import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

// Update the type to match the server response:
type BoidDataFromServer = {
  boid_id: string;
  user_id: string;
  user_name: string;
  date_joined: string;
  color: string;
  position_x: number;
  position_y: number;
  velocity_x: number;
  velocity_y: number;
  acceleration_x: number;
  acceleration_y: number;
};

// Use string for IDs since the server returns UUIDs
type BoidType = {
  id: string;       // using user_id from the server (a UUID string)
  userID: string;
  userName: string;
  color: string;
  position_x: number;
  position_y: number;
  velocity_x: number;
  velocity_y: number;
  acceleration_x: number;
  acceleration_y: number;
};

type BoidProps = {
  boid: BoidType;
};

const SIMULATION_INTERVAL = 1 / 30; 
const SYNC_INTERVAL = 10000; // sync every 10 seconds

const Boid: React.FC<BoidProps> = ({ boid }) => {
  const positionX = useSharedValue(boid.position_x);
  const positionY = useSharedValue(boid.position_y);

  useEffect(() => {
    positionX.value = boid.position_x;
    positionY.value = boid.position_y;
  }, [boid.position_x, boid.position_y]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: positionX.value },
      { translateY: positionY.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.boid,
        animatedStyle,
        { backgroundColor: boid.color },
      ]}
    />
  );
};

const BoidsSimulation: React.FC = () => {
  const CONFIG_URL =
    'https://senior-project-backend-django.onrender.com/boids_service/config/';
  const BOIDS_URL =
    'https://senior-project-backend-django.onrender.com/boids_service/simulation_boids/';

  const [boids, setBoids] = useState<BoidType[]>([]);
  const [config, setConfig] = useState<{
    WORLD_WIDTH: number;
    WORLD_HEIGHT: number;
    ALIGNMENT_PERCEPTION_RADIUS: number;
    SEPERATION_PERCEPTION_RADIUS: number;
    COHESION_PERCEPTION_RADIUS: number;
    ALIGNMENT_STRENGTH: number;
    COHESION_STRENGTH: number;
    SEPERATION_STRENGTH: number;
    MIN_SCALE_LENGTH: number;
  } | null>(null);

  // Helper to limit a vector’s magnitude
  const limitVector = (vector: { x: number; y: number }, max: number) => {
    const mag = Math.hypot(vector.x, vector.y);
    if (mag > max) {
      vector.x = (vector.x / mag) * max;
      vector.y = (vector.y / mag) * max;
    }
    return vector;
  };

  // Fetch the simulation configuration from the server
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(CONFIG_URL);
        const data = await response.json();
        setConfig(data);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };
    fetchConfig();
  }, []);

  // Fetch the initial boids from the server
  useEffect(() => {
    const fetchInitialBoids = async () => {
      try {
        const response = await fetch(BOIDS_URL);
        const data = (await response.json()) as Record<string, BoidDataFromServer>;

        const MAX_SPEED = 0.5;

        const initialBoids = Object.entries(data).map(([key, serverBoid]) => {
          const limitedVelocity = limitVector(
            { x: serverBoid.velocity_x, y: serverBoid.velocity_y },
            MAX_SPEED
          );
          return {
            id: serverBoid.user_id, // IDs are strings (UUID)
            userID: serverBoid.user_id,
            userName: serverBoid.user_name,
            color: serverBoid.color,
            position_x: serverBoid.position_x,
            position_y: serverBoid.position_y,
            velocity_x: limitedVelocity.x,
            velocity_y: limitedVelocity.y,
            acceleration_x: serverBoid.acceleration_x,
            acceleration_y: serverBoid.acceleration_y,
          } as BoidType;
        });

        setBoids(initialBoids);
      } catch (error) {
        console.error('Error fetching initial boids:', error);
      }
    };

    fetchInitialBoids();
  }, []);

  // Calculate the acceleration for a boid based on its neighbors
  const calculateBoidAcceleration = (
    boid: BoidType,
    allBoids: BoidType[],
    {
      ALIGNMENT_PERCEPTION_RADIUS,
      SEPERATION_PERCEPTION_RADIUS,
      COHESION_PERCEPTION_RADIUS,
      ALIGNMENT_STRENGTH,
      COHESION_STRENGTH,
      SEPERATION_STRENGTH,
      MIN_SCALE_LENGTH,
      MAX_FORCE,
      MAX_SPEED,
    }: {
      ALIGNMENT_PERCEPTION_RADIUS: number;
      SEPERATION_PERCEPTION_RADIUS: number;
      COHESION_PERCEPTION_RADIUS: number;
      ALIGNMENT_STRENGTH: number;
      COHESION_STRENGTH: number;
      SEPERATION_STRENGTH: number;
      MIN_SCALE_LENGTH: number;
      MAX_FORCE: number;
      MAX_SPEED: number;
    }
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

        // Alignment: average the velocities of nearby boids
        if (distance < ALIGNMENT_PERCEPTION_RADIUS) {
          alignment.x += otherBoid.velocity_x;
          alignment.y += otherBoid.velocity_y;
          totalAlignment++;
        }

        // Cohesion: steer toward the average position of nearby boids
        if (distance < COHESION_PERCEPTION_RADIUS) {
          cohesion.x += otherBoid.position_x;
          cohesion.y += otherBoid.position_y;
          totalCohesion++;
        }

        // Separation: steer away from boids that are too close
        if (distance < SEPERATION_PERCEPTION_RADIUS && distance > 0) {
          let diffX = boid.position_x - otherBoid.position_x;
          let diffY = boid.position_y - otherBoid.position_y;
          diffX /= distance * distance;
          diffY /= distance * distance;
          separation.x += diffX;
          separation.y += diffY;
          totalSeparation++;
        }
      }
    });

    let steering = { x: 0, y: 0 };

    // Alignment steering
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

    // Cohesion steering
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

    // Separation steering
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
      separation.x *= SEPERATION_STRENGTH;
      separation.y *= SEPERATION_STRENGTH;
      steering.x += separation.x;
      steering.y += separation.y;
    }

    return steering;
  };

  // The simulation update effect (note: only [config] is a dependency)
  useEffect(() => {
    if (!config) return;
    const {
      WORLD_WIDTH,
      WORLD_HEIGHT,
      ALIGNMENT_PERCEPTION_RADIUS,
      SEPERATION_PERCEPTION_RADIUS,
      COHESION_PERCEPTION_RADIUS,
      ALIGNMENT_STRENGTH,
      COHESION_STRENGTH,
      SEPERATION_STRENGTH,
      MIN_SCALE_LENGTH,
    } = config;
    const MAX_FORCE = 0.05;
    const MAX_SPEED = 0.5;
    const intervalId = setInterval(() => {
      setBoids((prevBoids) => {
        return prevBoids.map((boid, _, allBoids) => {
          const acceleration = calculateBoidAcceleration(boid, allBoids, {
            ALIGNMENT_PERCEPTION_RADIUS,
            SEPERATION_PERCEPTION_RADIUS,
            COHESION_PERCEPTION_RADIUS,
            ALIGNMENT_STRENGTH,
            COHESION_STRENGTH,
            SEPERATION_STRENGTH,
            MIN_SCALE_LENGTH,
            MAX_FORCE,
            MAX_SPEED,
          });

          // Update velocity with acceleration
          let newVelocityX = boid.velocity_x + acceleration.x;
          let newVelocityY = boid.velocity_y + acceleration.y;
          let speed = Math.hypot(newVelocityX, newVelocityY);
          if (speed > MAX_SPEED) {
            newVelocityX = (newVelocityX / speed) * MAX_SPEED;
            newVelocityY = (newVelocityY / speed) * MAX_SPEED;
          }

          // Update position
          let newPositionX = boid.position_x + newVelocityX;
          let newPositionY = boid.position_y + newVelocityY;
          // Wrap around the world edges
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
  }, [config]);

  // Synchronize periodically with the server
  useEffect(() => {
    if (!config) return;
    const MAX_SPEED = 0.5; // ensure this matches the simulation
    const syncWithServer = async () => {
      try {
        const response = await fetch(BOIDS_URL);
        const data = (await response.json()) as Record<string, BoidDataFromServer>;
        const serverBoids = Object.entries(data).map(([key, serverBoid]) => {
          const limitedVelocity = limitVector(
            { x: serverBoid.velocity_x, y: serverBoid.velocity_y },
            MAX_SPEED
          );
          return {
            id: serverBoid.user_id,
            userID: serverBoid.user_id,
            userName: serverBoid.user_name,
            color: serverBoid.color,
            position_x: serverBoid.position_x,
            position_y: serverBoid.position_y,
            velocity_x: limitedVelocity.x,
            velocity_y: limitedVelocity.y,
            acceleration_x: serverBoid.acceleration_x,
            acceleration_y: serverBoid.acceleration_y,
          } as BoidType;
        });

        setBoids((prevBoids) => {
          const serverBoidsMap = new Map<string, BoidType>();
          serverBoids.forEach((sb) => serverBoidsMap.set(sb.id, sb));

          const updatedBoids = prevBoids.map((boid) => {
            const serverBoid = serverBoidsMap.get(boid.id);
            return serverBoid ? { ...boid, ...serverBoid } : boid;
          });

          const prevBoidsIds = new Set(prevBoids.map((b) => b.id));
          serverBoids.forEach((sb) => {
            if (!prevBoidsIds.has(sb.id)) {
              updatedBoids.push(sb);
            }
          });

          return updatedBoids;
        });
      } catch (error) {
        console.error('Error synchronizing with server:', error);
      }
    };

    const intervalId = setInterval(syncWithServer, SYNC_INTERVAL);
    return () => clearInterval(intervalId);
  }, [config]);

  // Map world coordinates to screen coordinates
  const mapToScreen = (x: number, y: number) => {
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
    if (!config) return { x, y };
    const { WORLD_WIDTH, WORLD_HEIGHT } = config;
    return {
      x: (x / WORLD_WIDTH) * SCREEN_WIDTH,
      y: (y / WORLD_HEIGHT) * SCREEN_HEIGHT,
    };
  };

  if (!config) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {boids.map((boid) => {
        // Convert world positions to screen positions
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
    width: 10,
    height: 10,
    position: 'absolute',
    borderRadius: 5,
  },
});

export default BoidsSimulation;

