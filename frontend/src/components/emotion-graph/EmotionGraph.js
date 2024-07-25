import React, { useEffect, useRef } from 'react';
import h337 from 'heatmap.js';
import './EmotionGraph.css';

const EmotionGraph = ({ data }) => {
  const heatmapContainerRef = useRef(null);
  const heatmapInstance = useRef(null);

  useEffect(() => {
    const container = heatmapContainerRef.current;
    if (!container) return;

    heatmapInstance.current = h337.create({
      container,
      radius: 25, // 히트맵 점 반지름
      maxOpacity: 0.6, // 최대 불투명도
      minOpacity: 0, // 최소 불투명도
      blur: 0.75, // 흐림
      gradient: {
        0.45: "blue",
        0.55: "green",
        0.65: "yellow",
        0.95: "red",
      },
    });

    const heatmapData = {
      max: 1,
      min: 0,
      data: data.map(point => ({
        x: Math.round(((point.x + 1) / 2) * container.offsetWidth),
        y: Math.round(((1 - point.y) / 2) * container.offsetHeight),
        value: point.value
      }))
    };

    heatmapInstance.current.setData(heatmapData);
  }, [data]);

  return (
    <div className="graph-container">
      <div className="axis x-axis"></div>
      <div className="axis y-axis"></div>
      <div className="label x">Arousal</div>
      <div className="label y">Valence</div>
      <div ref={heatmapContainerRef} className="heatmapContainer" />
    </div>
  );
};

export default EmotionGraph;
