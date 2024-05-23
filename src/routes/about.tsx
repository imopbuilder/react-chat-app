import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/about')({
  component: React.memo(About),
});

function About() {
  console.log('/about');

  return <div>Hello /about!</div>;
}
