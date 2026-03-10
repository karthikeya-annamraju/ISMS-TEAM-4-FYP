import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  id: number;
  size: number;
  color: string;
  targetX?: number;
  targetY?: number;
  attraction: number;
}

const NetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = [
      'rgba(139, 92, 246, 0.8)',   // Primary purple
      'rgba(59, 130, 246, 0.6)',   // Blue
      'rgba(168, 85, 247, 0.7)',   // Purple variant
      'rgba(147, 51, 234, 0.5)',   // Deep purple
      'rgba(99, 102, 241, 0.6)',   // Indigo
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createNodes = () => {
      const nodeCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
      nodesRef.current = Array.from({ length: nodeCount }, (_, i) => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        id: i,
        size: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        attraction: Math.random() * 0.02 + 0.001,
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update node positions with dynamic behavior
      nodesRef.current.forEach((node, index) => {
        // Mouse attraction
        const mouseDistance = Math.sqrt(
          Math.pow(node.x - mouseRef.current.x, 2) + 
          Math.pow(node.y - mouseRef.current.y, 2)
        );
        
        if (mouseDistance < 150) {
          const mouseForce = (150 - mouseDistance) / 150;
          const angle = Math.atan2(mouseRef.current.y - node.y, mouseRef.current.x - node.x);
          node.vx += Math.cos(angle) * mouseForce * 0.02;
          node.vy += Math.sin(angle) * mouseForce * 0.02;
        }

        // Node-to-node attraction/repulsion
        nodesRef.current.forEach((otherNode, otherIndex) => {
          if (index !== otherIndex) {
            const dx = otherNode.x - node.x;
            const dy = otherNode.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200 && distance > 0) {
              const force = (distance < 100) ? -0.001 : node.attraction; // Repel if too close, attract if medium distance
              const angle = Math.atan2(dy, dx);
              node.vx += Math.cos(angle) * force;
              node.vy += Math.sin(angle) * force;
            }
          }
        });

        // Apply velocity with damping
        node.vx *= 0.99;
        node.vy *= 0.99;
        
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges with some randomness
        if (node.x <= 0 || node.x >= canvas.width) {
          node.vx *= -0.8;
          node.vx += (Math.random() - 0.5) * 0.5;
        }
        if (node.y <= 0 || node.y >= canvas.height) {
          node.vy *= -0.8;
          node.vy += (Math.random() - 0.5) * 0.5;
        }

        // Keep within bounds
        node.x = Math.max(10, Math.min(canvas.width - 10, node.x));
        node.y = Math.max(10, Math.min(canvas.height - 10, node.y));
      });

      // Draw connections with dynamic opacity and width
      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const nodeA = nodesRef.current[i];
          const nodeB = nodesRef.current[j];
          const distance = Math.sqrt(
            Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2)
          );

          if (distance < 180) {
            const opacity = 1 - distance / 180;
            const lineWidth = opacity * 2;
            
            // Gradient line
            const gradient = ctx.createLinearGradient(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
            gradient.addColorStop(0, nodeA.color.replace('0.8)', `${opacity * 0.6})`));
            gradient.addColorStop(1, nodeB.color.replace('0.8)', `${opacity * 0.6})`));
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes with glow effect
      nodesRef.current.forEach(node => {
        const mouseDistance = Math.sqrt(
          Math.pow(node.x - mouseRef.current.x, 2) + 
          Math.pow(node.y - mouseRef.current.y, 2)
        );
        
        const glowIntensity = mouseDistance < 100 ? (100 - mouseDistance) / 100 : 0;
        
        // Outer glow
        if (glowIntensity > 0) {
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 20 * glowIntensity;
        } else {
          ctx.shadowBlur = 5;
        }
        
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + glowIntensity * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner bright core
        ctx.shadowBlur = 0;
        ctx.fillStyle = node.color.replace(/0\.\d+/, '1');
        ctx.beginPath();
        ctx.arc(node.x, node.y, (node.size + glowIntensity * 2) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Reset shadow
      ctx.shadowBlur = 0;
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createNodes();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createNodes();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.05) 0%, transparent 70%)' }}
      />
      
      {/* Additional floating elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-xl"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * window.innerWidth,
              top: Math.random() * window.innerHeight,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default NetworkBackground;
