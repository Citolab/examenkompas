import React from 'react';

export function DomeinIcon(props: { name: string; kleur: string }) {
  return (
    <div
      style={{ backgroundColor: props.kleur, color: `rgba(0, 0, 0, 0.3)` }}
      className="capitalize flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold leading-none"
    >
      {props.name?.replace('- ', '').substr(0, 2)}
    </div>
  );
}
