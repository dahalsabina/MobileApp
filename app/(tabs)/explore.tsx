import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';


// Define types for Boid properties
type Position = {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
};

type Velocity = {
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
};

type BoidProps = {
  boid: {
    id: number;
    position: Position;
    velocity: Velocity;
  };
};

// Boid component representing one bird
const Boid: React.FC<BoidProps> = ({ boid }) => {
  // Animated style for movement
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: boid.position.x.value },
        { translateY: boid.position.y.value },
      ],
    };
  });

  return <Animated.View style={[styles.boid, animatedStyle]} />;
};

// BoidsSimulation Component

// Main component to display multiple boids
const BoidsSimulation: React.FC = () => {
  const numberOfBoids = 20;

  // Stores each boid with a unique id, position, and velocity
  const boids: Array<{ id: number; position: Position; velocity: Velocity }> = [];

  // Initialize boids with position and velocity
  for (let i = 0; i < numberOfBoids; i++) {
    const position: Position = {
      x: useSharedValue(Math.random() * 300),
      y: useSharedValue(Math.random() * 600),
    };

    const velocity: Velocity = {
      x: useSharedValue(Math.random() * 4 - 2),
      y: useSharedValue(Math.random() * 4 - 2),
    };

    boids.push({ id: i, position, velocity });
  }

  // Update boids positions and velocities
  boids.forEach((boid) => {
    useDerivedValue(() => {
      // Initialize acceleration
      let accelerationX = 0;
      let accelerationY = 0;

      // Boids algorithm parameters
      const neighborDist = 100;
      const separationDist = 25;
      let total = 0;
      let avgVelocityX = 0;
      let avgVelocityY = 0;
      let avgPositionX = 0;
      let avgPositionY = 0;
      let separationX = 0;
      let separationY = 0;

      // Loop through all boids to apply rules
      boids.forEach((otherBoid) => {
        if (boid.id !== otherBoid.id) {
          const dx = otherBoid.position.x.value - boid.position.x.value;
          const dy = otherBoid.position.y.value - boid.position.y.value;
          const distance = Math.hypot(dx, dy);

          if (distance < neighborDist) {
            // Alignment
            avgVelocityX += otherBoid.velocity.x.value;
            avgVelocityY += otherBoid.velocity.y.value;

            // Cohesion
            avgPositionX += otherBoid.position.x.value;
            avgPositionY += otherBoid.position.y.value;

            total++;

            // Separation
            if (distance < separationDist) {
              separationX -= dx;
              separationY -= dy;
            }
          }
        }
      });

      if (total > 0) {
        // Alignment
        avgVelocityX /= total;
        avgVelocityY /= total;
        boid.velocity.x.value += (avgVelocityX - boid.velocity.x.value) * 0.05;
        boid.velocity.y.value += (avgVelocityY - boid.velocity.y.value) * 0.05;

        // Cohesion
        avgPositionX /= total;
        avgPositionY /= total;
        boid.velocity.x.value += (avgPositionX - boid.position.x.value) * 0.005;
        boid.velocity.y.value += (avgPositionY - boid.position.y.value) * 0.005;

        // Separation
        boid.velocity.x.value += separationX * 0.05;
        boid.velocity.y.value += separationY * 0.05;
      }

      // Update positions based on velocities
      boid.position.x.value += boid.velocity.x.value;
      boid.position.y.value += boid.velocity.y.value;

      // Boundary conditions
      if (boid.position.x.value < 0 || boid.position.x.value > 300) {
        boid.velocity.x.value *= -1;
      }
      if (boid.position.y.value < 0 || boid.position.y.value > 600) {
        boid.velocity.y.value *= -1;
      }

      // Limit speed
      const speed = Math.hypot(boid.velocity.x.value, boid.velocity.y.value);
      const maxSpeed = 4;
      if (speed > maxSpeed) {
        boid.velocity.x.value = (boid.velocity.x.value / speed) * maxSpeed;
        boid.velocity.y.value = (boid.velocity.y.value / speed) * maxSpeed;
      }
    });
  });

  return (
    <View style={styles.container}>
      {boids.map((boid) => (
        <Boid key={boid.id} boid={boid} />
      ))}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  boid: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    position: 'absolute',
    borderRadius: 5,
  },
});

export default BoidsSimulation;