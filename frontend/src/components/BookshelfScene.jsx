import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'

function Book({ position, color, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[0.3, 2, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0.16, 0, 0]}>
        <boxGeometry args={[0.03, 1.9, 1.1]} />
        <meshStandardMaterial color="#f2f2f7" roughness={0.6} />
      </mesh>
    </group>
  )
}

function BookshelfScene() {
  return (
    <div style={{ height: '260px', width: '100%' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.4} color="#7c6cff" />
        <pointLight position={[-5, -3, 3]} intensity={1} color="#00e5ff" />

        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
          <group rotation={[0.15, 0.5, 0]}>
            <Book position={[-2, 0, 0]} color="#7c6cff" />
            <Book position={[-1, 0, 0]} color="#5a4fcf" />
            <Book position={[0, 0, 0]} color="#00e5ff" />
            <Book position={[1, 0.15, 0]} color="#a78bff" rotation={[0, 0, 0.2]} />
            <Book position={[2, 0, 0]} color="#4caf50" />
          </group>
        </Float>

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
      </Canvas>
    </div>
  )
}

export default BookshelfScene