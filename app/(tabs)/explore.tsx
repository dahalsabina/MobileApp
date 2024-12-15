// Import necessary libraries
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

// Define the type for a single boid as received from the server
type BoidDataFromServer = {
  userName: string;
  userID: string;
  color: string;
  position_x: number;
  position_y: number;
  velocity_x: number;
  velocity_y: number;
  acceleration_x: number;
  acceleration_y: number;
};

// Extend BoidDataFromServer to include client-side properties
type BoidType = BoidDataFromServer & {
  id: string; // Use userID from the server as the unique identifier
};

// Define props for the Boid component
type BoidProps = {
  boid: BoidType;
};

// Boid simulation parameters (updated to match server)
const SIMULATION_INTERVAL = 16; // Approx. 60 frames per second


const ALIGNMENT_PERCEPTION_RADIUS = 50;
const SEPARATION_PERCEPTION_RADIUS = 25;
const COHESION_PERCEPTION_RADIUS = 50;

// Strength multipliers
const ALIGNMENT_STRENGTH = 2;
const COHESION_STRENGTH = 3;
const SEPARATION_STRENGTH = 5;

// Other constants
const MAX_FORCE = 0.05;
const MAX_SPEED = 1;
const MIN_SCALE_LENGTH = 1e-6;

const Boid: React.FC<BoidProps> = ({ boid }) => {
  // Create shared values for position
  const positionX = useSharedValue(boid.position_x);
  const positionY = useSharedValue(boid.position_y);

  // Update shared values whenever the boid's position changes
  useEffect(() => {
    positionX.value = boid.position_x;
    positionY.value = boid.position_y;
  }, [boid.position_x, boid.position_y]);

  // Create an animated style based on the shared position values
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: positionX.value },
        { translateY: positionY.value },
      ],
    };
  });

  // Use the color provided by the server
  const boidColor = boid.color;

  return (
    <Animated.View
      style={[
        styles.boid,
        animatedStyle,
        { backgroundColor: boidColor },
      ]}
    />
  );
};

const BoidsSimulation: React.FC = () => {
  const SERVER_URL =
    'https://senior-project-backend-django.onrender.com/boids-service/db_boids/';
  const [boids, setBoids] = useState<BoidType[]>([]);

  // Function to limit a vector's magnitude
  const limitVector = (vector: { x: number; y: number }, max: number) => {
    const mag = Math.hypot(vector.x, vector.y);
    if (mag > max) {
      vector.x = (vector.x / mag) * max;
      vector.y = (vector.y / mag) * max;
    }
    return vector;
  };

  // Fetch initial boids data
  useEffect(() => {
    const fetchInitialBoids = async () => {
      try {
        const response = await fetch(SERVER_URL);
        const data = (await response.json()) as Record<
          string,
          BoidDataFromServer
        >;

        const initialBoids = Object.entries(data).map(
          ([key, serverBoid]) => {
            // Limit initial velocities
            const limitedVelocity = limitVector(
              {
                x: serverBoid.velocity_x,
                y: serverBoid.velocity_y,
              },
              MAX_SPEED
            );

            return {
              ...serverBoid,
              id: serverBoid.userID,
              velocity_x: limitedVelocity.x,
              velocity_y: limitedVelocity.y,
            } as BoidType;
          }
        );

        setBoids(initialBoids);
      } catch (error) {
        console.error('Error fetching initial boids:', error);
      }
    };

    fetchInitialBoids();
  }, []);

  // Run boids simulation locally
  useEffect(() => {
    const intervalId = setInterval(() => {
      setBoids((prevBoids) => {
        return prevBoids.map((boid, _, allBoids) => {
          const acceleration = calculateBoidAcceleration(boid, allBoids);

          // Update velocity
          let newVelocityX = boid.velocity_x + acceleration.x;
          let newVelocityY = boid.velocity_y + acceleration.y;

          // Limit speed to MAX_SPEED
          let speed = Math.hypot(newVelocityX, newVelocityY);
          if (speed > MAX_SPEED) {
            newVelocityX = (newVelocityX / speed) * MAX_SPEED;
            newVelocityY = (newVelocityY / speed) * MAX_SPEED;
          }

          // Update position
          let newPositionX = boid.position_x + newVelocityX;
          let newPositionY = boid.position_y + newVelocityY;

          // Handle wrapping around world edges
          const WORLD_WIDTH = 1000;
          const WORLD_HEIGHT = 1000;

          if (newPositionX > WORLD_WIDTH) newPositionX = 0;
          else if (newPositionX < 0) newPositionX = WORLD_WIDTH;

          if (newPositionY > WORLD_HEIGHT) newPositionY = 0;
          else if (newPositionY < 0) newPositionY = WORLD_HEIGHT;

          return {
            ...boid,
            position_x: newPositionX,
            position_y: newPositionY,
            velocity_x: newVelocityX,
            velocity_y: newVelocityY,
          };
        });
      });
    }, SIMULATION_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  // Periodic synchronization with server
  useEffect(() => {
    const SYNC_INTERVAL = 10000; // Every 10 seconds

    const syncWithServer = async () => {
      try {
        const response = await fetch(SERVER_URL);
        const data = (await response.json()) as Record<
          string,
          BoidDataFromServer
        >;

        const serverBoids = Object.entries(data).map(
          ([key, serverBoid]) => {
            // Limit velocities from server
            const limitedVelocity = limitVector(
              {
                x: serverBoid.velocity_x,
                y: serverBoid.velocity_y,
              },
              MAX_SPEED
            );

            return {
              ...serverBoid,
              id: serverBoid.userID,
              velocity_x: limitedVelocity.x,
              velocity_y: limitedVelocity.y,
            } as BoidType;
          }
        );

        setBoids((prevBoids) => {
          // Create a map of server boids by id
          const serverBoidsMap = new Map<string, BoidType>();
          serverBoids.forEach((serverBoid) => {
            serverBoidsMap.set(serverBoid.id, serverBoid);
          });

          // Update existing boids
          const updatedBoids = prevBoids.map((boid) => {
            const serverBoid = serverBoidsMap.get(boid.id);
            if (serverBoid) {
              // Update boid with server data
              return {
                ...boid,
                ...serverBoid,
              };
            } else {
              // Boid not in server data, decide whether to keep or remove
              // For now, we keep it
              return boid;
            }
          });

          // Add new boids from server that are not in prevBoids
          const prevBoidsIds = new Set(prevBoids.map((boid) => boid.id));
          serverBoids.forEach((serverBoid) => {
            if (!prevBoidsIds.has(serverBoid.id)) {
              // New boid, add it
              updatedBoids.push(serverBoid);
            }
          });

          return updatedBoids;
        });
      } catch (error) {
        console.error('Error synchronizing with server:', error);
      }
    };

    const intervalId = setInterval(() => {
      syncWithServer();
    }, SYNC_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  // Calculate boid acceleration based on boids algorithm  to match server)
  const calculateBoidAcceleration = (
    boid: BoidType,
    allBoids: BoidType[]
  ) => {
    let alignment = { x: 0, y: 0 };
    let cohesion = { x: 0, y: 0 };
    let separation = { x: 0, y: 0 };

    let totalAlignment = 0;
    let totalCohesion = 0;
    let totalSeparation = 0;

    allBoids.forEach((otherBoid) => {
      if (otherBoid.id !== boid.id) {
        const dx = otherBoid.position_x - boid.position_x;
        const dy = otherBoid.position_y - boid.position_y;
        const distance = Math.hypot(dx, dy);

        // Alignment
        if (distance < ALIGNMENT_PERCEPTION_RADIUS) {
          alignment.x += otherBoid.velocity_x;
          alignment.y += otherBoid.velocity_y;
          totalAlignment++;
        }

        // Cohesion
        if (distance < COHESION_PERCEPTION_RADIUS) {
          cohesion.x += otherBoid.position_x;
          cohesion.y += otherBoid.position_y;
          totalCohesion++;
        }

        // Separation
        if (distance < SEPARATION_PERCEPTION_RADIUS && distance > 0) {
          let diffX = boid.position_x - otherBoid.position_x;
          let diffY = boid.position_y - otherBoid.position_y;
          // Avoid division by zero
          if (distance !== 0) {
            diffX /= distance * distance;
            diffY /= distance * distance;
          }
          separation.x += diffX;
          separation.y += diffY;
          totalSeparation++;
        }
      }
    });

    // Compute final steering forces
    let steering = { x: 0, y: 0 };

    // Alignment
    if (totalAlignment > 0) {
      alignment.x /= totalAlignment;
      alignment.y /= totalAlignment;
      let alignmentMag = Math.hypot(alignment.x, alignment.y);
      if (alignmentMag > MIN_SCALE_LENGTH) {
        alignment.x = (alignment.x / alignmentMag) * MAX_SPEED;
        alignment.y = (alignment.y / alignmentMag) * MAX_SPEED;
      }
      alignment.x -= boid.velocity_x;
      alignment.y -= boid.velocity_y;
      alignment = limitVector(alignment, MAX_FORCE);
      alignment.x *= ALIGNMENT_STRENGTH;
      alignment.y *= ALIGNMENT_STRENGTH;
      steering.x += alignment.x;
      steering.y += alignment.y;
    }

    // Cohesion
    if (totalCohesion > 0) {
      cohesion.x /= totalCohesion;
      cohesion.y /= totalCohesion;
      cohesion.x -= boid.position_x;
      cohesion.y -= boid.position_y;
      let cohesionMag = Math.hypot(cohesion.x, cohesion.y);
      if (cohesionMag > MIN_SCALE_LENGTH) {
        cohesion.x = (cohesion.x / cohesionMag) * MAX_SPEED;
        cohesion.y = (cohesion.y / cohesionMag) * MAX_SPEED;
      }
      cohesion.x -= boid.velocity_x;
      cohesion.y -= boid.velocity_y;
      cohesion = limitVector(cohesion, MAX_FORCE);
      cohesion.x *= COHESION_STRENGTH;
      cohesion.y *= COHESION_STRENGTH;
      steering.x += cohesion.x;
      steering.y += cohesion.y;
    }

    // Separation
    if (totalSeparation > 0) {
      separation.x /= totalSeparation;
      separation.y /= totalSeparation;
      let separationMag = Math.hypot(separation.x, separation.y);
      if (separationMag > MIN_SCALE_LENGTH) {
        separation.x = (separation.x / separationMag) * MAX_SPEED;
        separation.y = (separation.y / separationMag) * MAX_SPEED;
      }
      separation.x -= boid.velocity_x;
      separation.y -= boid.velocity_y;
      separation = limitVector(separation, MAX_FORCE);
      separation.x *= SEPARATION_STRENGTH;
      separation.y *= SEPARATION_STRENGTH;
      steering.x += separation.x;
      steering.y += separation.y;
    }

    return steering;
  };










  

  // Function to map world coordinates to screen coordinates
  const mapToScreen = (x: number, y: number) => {
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
      Dimensions.get('window');
    const WORLD_WIDTH = 1000;
    const WORLD_HEIGHT = 1000;
    return {
      x: (x / WORLD_WIDTH) * SCREEN_WIDTH,
      y: (y / WORLD_HEIGHT) * SCREEN_HEIGHT,
    };
  };

  return (
    <View style={styles.container}>
      {boids.map((boid) => {
        // Map world positions to screen positions
        const screenPosition = mapToScreen(boid.position_x, boid.position_y);
        const boidWithScreenPosition = {
          ...boid,
          position_x: screenPosition.x,
          position_y: screenPosition.y,
        };
        return <Boid key={boid.id} boid={boidWithScreenPosition} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0b16',
  },
  boid: {
    width: 5,
    height: 5,
    position: 'absolute',
    borderRadius: 2.5,
  },
});

export default BoidsSimulation;
