import ReactDOM from 'react-dom';
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import {
  Illustration,
  Ellipse,
  Shape,
  useRender,
  Cone,
  Hemisphere,
  Cylinder,
} from 'react-zdog';
// New react-spring target, for native animation outside of React
import { a, useSpring } from '@react-spring/zdog';
// import { config } from 'react-spring';
// import './styles.css'

/** --- Basic, re-usable shapes -------------------------- */
const TAU = Math.PI * 2;
const easeSpring = (x: number) => {
  const c4 = (2 * Math.PI) / 3;

  return x === 0
    ? 0
    : x === 1
    ? 1
    : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};
/** --- Assembly ----------------------------------------- */
function Kompass(props) {
  const [up, setUp] = useState(true);
  const [glance, setGlance] = useState(true);

  // Change motion every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (props.isPlaying) {
        setUp((previous) => !previous);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [props.isPlaying]);

  // Turn static values into animated values
  const { rotation } = useSpring({
    rotation: up ? 0 : Math.PI,
    config: {
      duration: 5000,
      easing: easeSpring,
    },
  });
  const { color } = useSpring({
    color: glance ? '#FFD6D6' : '#fff0f0',
  });
  // useRender allows us to hook into the render-loop
  const ref = useRef(null);

  let ty = 0;
  let tx = 0;
  useRender(() => {
    if (props.isPlaying) {
      ref.current.rotate.y = Math.cos((ty += 0.03) / TAU) / 4;
      ref.current.rotate.x = Math.cos((tx += 0.05) / TAU) / 4;
      ref.current.rotate.y > 0.8 ? setGlance(false) : setGlance(true);
    }
  });
  return (
    <Cylinder
      ref={ref}
      length="1"
      diameter="28"
      color="#FFD6D6"
      backface="#FFD6D6"
      //   color={color}
      //   backface={color}
      translate={{ z: 0 }}
    >
      <Ellipse
        ref={ref}
        width="30"
        height="30"
        stroke={1.5}
        color="#EA4747"
        translate={{ z: 2 }}
      >
        <Shape
          path={[{ y: -0.5 }, { y: 1 }]}
          translate={{ y: -11, z: 2 }}
          stroke={1}
          color="#fff"
        ></Shape>
        <Shape
          path={[{ y: -0.5 }, { y: 1 }]}
          translate={{ y: 11, z: 2 }}
          stroke={1}
          color="#fff"
        ></Shape>
        <Shape
          path={[{ x: -0.5 }, { x: 1 }]}
          translate={{ x: 11, z: 2 }}
          stroke={1}
          color="#fff"
        ></Shape>
        <Shape
          path={[{ x: -0.5 }, { x: 1 }]}
          translate={{ x: -11, z: 2 }}
          stroke={1}
          color="#fff"
        ></Shape>
        <a.Anchor
          rotate={rotation.interpolate((r) => ({ z: TAU / 18 + -r / 4 }))}
        >
          <Cone
            diameter="4"
            translate={{ z: 4 }}
            rotate={{ x: 3.14 / 2 }}
            length="10"
            stroke={false}
            color="#4F79A3"
            backface={false}
          ></Cone>
          <Cone
            diameter="4"
            translate={{ z: 4 }}
            rotate={{ x: 3.14 / 2, y: 3.1415 }}
            length="10"
            stroke={false}
            color="#2A4B72"
            backface={false}
          ></Cone>
        </a.Anchor>
        <Hemisphere
          diameter="2"
          translate={{ z: 6 }}
          stroke={false}
          color="#fff"
          backface={false}
        />
      </Ellipse>
    </Cylinder>
  );
}

export function KompasZdog() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div
      className="w-full h-full"
      onClick={() => {
        setIsPlaying((previous) => !previous);
        console.log('test');
      }}
    >
      <Illustration dragRotate={true} zoom={8} translate={{ y: -3 }}>
        <Ellipse
          diameter={20}
          rotate={{ x: -TAU / 3 }}
          translate={{ y: 15, z: -4 }}
          stroke={4}
          color="#373740"
          fill
        />
        <Kompass isPlaying={isPlaying} />
      </Illustration>
    </div>
  );
}

// rotate={rotation.interpolate((r) => ({ z: TAU / 18 + -r / 4 }))}
// <Shape ref={ref} path={[{ x: -3 }, { x: 3 }]} stroke={4} color="#747B9E">
//   <a.Anchor rotate={rotation.interpolate((r) => ({ x: TAU / 18 + -r / 4 }))}>
//     <Shape path={[{ x: -1.5 }, { x: 1.5 }]} translate={{ y: -6 }} stroke={9} color="#E1E5EE">
//       <a.Shape stroke={11} translate={{ y: -9.5 }} color={color}>
//         <Shape translate={{ x: 0, y: -2, z: -4 }} stroke={8} color="#747B9E" />
//         <Ellipse diameter={6} rotate={{ x: -TAU / 10 }} translate={{ y: -4, z: -1 }} stroke={4} color="#444B6E" fill />
//         <Eye />
//         <Eye translate={{ x: 2.2, z: 4.5 }} />
//         <a.Ellipse diameter={1.3} scale={size} translate={{ y: 2, z: 4.5 }} rotate={{ z: TAU / 4 }} closed color="#444B6E" stroke={0.5} fill />
//         <Ellipse diameter={1} translate={{ x: -3.5, y: 1.5, z: 4.5 }} rotate={{ z: TAU / 4 }} closed color="indianred" stroke={0.5} fill />
//         <Ellipse diameter={1} translate={{ x: 3.5, y: 1.5, z: 4.5 }} rotate={{ z: TAU / 4 }} closed color="indianred" stroke={0.5} fill />
//         <Ellipse diameter={0.5} translate={{ x: 4.5, y: -4.5, z: 4.5 }} rotate={{ z: TAU / 4 }} closed color="lightblue" stroke={0.5} fill />
//       </a.Shape>
//       <Arm rotate={rotation.interpolate((r) => ({ x: -TAU / 4 + r }))} />
//       <Arm translate={{ x: 5, y: -2 }} rotate={rotation.interpolate((r) => ({ x: TAU / 4 - r }))} />
//     </Shape>
//   </a.Anchor>
//   <Leg rotate={rotation.interpolate((r) => ({ x: TAU / 5 - r / 1.2 }))} />
//   <Leg translate={{ x: 3 }} rotate={rotation.interpolate((r) => ({ x: -TAU / 5 + r / 1.2 }))} />
// </Shape>
