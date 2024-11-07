import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
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
    color: string; // Add color property
  };
};

// Boid component representing one bird
const Boid: React.FC<BoidProps> = ({ boid }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: boid.position.x.value },
        { translateY: boid.position.y.value },
      ],
    };
  });

  return <Animated.View style={[styles.boid, animatedStyle, { backgroundColor: boid.color }]} />;
};

// BoidsSimulation Component
const BoidsSimulation: React.FC = () => {
  const numberOfBoids = 20;
  const colors = ['#ff6b6b', '#ff9f43', '#1dd1a1', '#48dbfb', '#5f27cd']; // Array of colors

  const boids: Array<{ id: number; position: Position; velocity: Velocity; color: string }> = [];

  for (let i = 0; i < numberOfBoids; i++) {
    const position: Position = {
      x: useSharedValue(Math.random() * 300),
      y: useSharedValue(Math.random() * 600),
    };

    const velocity: Velocity = {
      x: useSharedValue(Math.random() * 4 - 2),
      y: useSharedValue(Math.random() * 4 - 2),
    };

    const color = colors[i % colors.length]; // Assign a color to each boid

    boids.push({ id: i, position, velocity, color });
  }

  boids.forEach((boid) => {
    useDerivedValue(() => {
      let accelerationX = 0;
      let accelerationY = 0;

      const neighborDist = 100;
      const separationDist = 25;
      let total = 0;
      let avgVelocityX = 0;
      let avgVelocityY = 0;
      let avgPositionX = 0;
      let avgPositionY = 0;
      let separationX = 0;
      let separationY = 0;

      boids.forEach((otherBoid) => {
        if (boid.id !== otherBoid.id) {
          const dx = otherBoid.position.x.value - boid.position.x.value;
          const dy = otherBoid.position.y.value - boid.position.y.value;
          const distance = Math.hypot(dx, dy);

          if (distance < neighborDist) {
            avgVelocityX += otherBoid.velocity.x.value;
            avgVelocityY += otherBoid.velocity.y.value;
            avgPositionX += otherBoid.position.x.value;
            avgPositionY += otherBoid.position.y.value;

            total++;

            if (distance < separationDist) {
              separationX -= dx;
              separationY -= dy;
            }
          }
        }
      });

      if (total > 0) {
        avgVelocityX /= total;
        avgVelocityY /= total;
        boid.velocity.x.value += (avgVelocityX - boid.velocity.x.value) * 0.05;
        boid.velocity.y.value += (avgVelocityY - boid.velocity.y.value) * 0.05;

        avgPositionX /= total;
        avgPositionY /= total;
        boid.velocity.x.value += (avgPositionX - boid.position.x.value) * 0.005;
        boid.velocity.y.value += (avgPositionY - boid.position.y.value) * 0.005;

        boid.velocity.x.value += separationX * 0.05;
        boid.velocity.y.value += separationY * 0.05;
      }

      boid.position.x.value += boid.velocity.x.value;
      boid.position.y.value += boid.velocity.y.value;

      if (boid.position.x.value < 0 || boid.position.x.value > 300) {
        boid.velocity.x.value *= -1;
      }
      if (boid.position.y.value < 0 || boid.position.y.value > 600) {
        boid.velocity.y.value *= -1;
      }

      const speed = Math.hypot(boid.velocity.x.value, boid.velocity.y.value);
      const maxSpeed = 3;
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
    backgroundColor: '#0e0b16', // Dark background for contrast
  },
  boid: {
    width: 10,
    height: 10,
    position: 'absolute',
    borderRadius: 5,
  },
});

export default BoidsSimulation;
