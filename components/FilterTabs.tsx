"use client";

import { Button } from '@/components/ui/button';
import { useState } from 'react';

const filters = [
  { id: 'trending', label: 'Trending' },
  { id: 'alltime', label: 'Alltime' },
  { id: 'latest', label: 'Latest' },
];

export default function FilterTabs() {
  const [activeFilter, setActiveFilter] = useState('trending');

  return (
    <div className="flex gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? 'default' : 'outline'}
          onClick={() => setActiveFilter(filter.id)}
          className="rounded-full"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}