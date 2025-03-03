import React, { useContext, useState, useEffect, useRef } from "react";
import AudioContext from "./AudioContext";
import { formatTime } from "./utils";
import { dot, subtract, multiply, add, norm } from "mathjs";

const ProgressBar = () => {
    const { currentTime, duration, bookmarks, audioRef } = useContext(AudioContext);
    const svgRef = useRef(null);
    const [hoverTime, setHoverTime] = useState(null);
    const [hoverPosition, setHoverPosition] = useState(null);

    const [svgSize, setSvgSize] = useState({ width: window.innerWidth * 0.8, height: window.innerHeight * 0.6 });

    useEffect(() => {
        const handleResize = () => {
            setSvgSize({ width: window.innerWidth * 0.8, height: window.innerHeight * 0.6 });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const pathData = [
        "M 20,20 H 140",
        "V 70",
        "H 20",
        "V 120",
        "H 140",
        "V 170",
        "H 20",
        "V 220",
        "H 140"
    ];

    const points = [
        { x: 20, y: 20 }, { x: 140, y: 20 },
        { x: 140, y: 70 }, { x: 20, y: 70 },
        { x: 20, y: 120 }, { x: 140, y: 120 },
        { x: 140, y: 170 }, { x: 20, y: 170 },
        { x: 20, y: 220 }, { x: 140, y: 220 }
    ];

    const progressRatio = duration > 0 ? currentTime / duration : 0;
    const pointPosition = points.length > 0 ? calculatePointPosition(points, progressRatio) : { x: 0, y: 0 };

    const handleClick = (event) => {
        if (!svgRef.current || !audioRef.current) return;
        const { offsetX, offsetY } = getSVGCoords(event, svgRef.current);
        const { time, closestPoint } = findClosestProgress(points, { x: offsetX, y: offsetY }, duration);

        if (time !== null && !isNaN(time) && time > 0 && audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const handleMouseMove = (event) => {
        if (!svgRef.current) return;
        const { offsetX, offsetY } = getSVGCoords(event, svgRef.current);
        const { time, closestPoint } = findClosestProgress(points, { x: offsetX, y: offsetY }, duration);

        if (time !== null) {
            setHoverTime(time);
            setHoverPosition({ x: closestPoint.x, y: closestPoint.y });
        } else {
            setHoverTime(null);
        }
    };

    return (
        <div style={styles.progressContainer}>
            <svg 
                ref={svgRef} 
                width={svgSize.width} 
                height={svgSize.height} 
                viewBox="0 0 200 250" 
                onClick={handleClick}
                onMouseMove={handleMouseMove}
            >
                <path d={pathData.join(" ")} stroke="black" fill="none" strokeWidth="3" />

                {bookmarks.map(({ time }, index) => {
                    if (!duration || isNaN(time) || time < 0) return null;
                    const progressRatio = time / duration;
                    if (isNaN(progressRatio) || progressRatio < 0 || progressRatio > 1) return null;

                    const bookmarkPosition = calculatePointPosition(points, progressRatio);

                    return (
                        <circle 
                            key={index} 
                            cx={bookmarkPosition.x} 
                            cy={bookmarkPosition.y} 
                            r="5" 
                            fill="lightcoral" 
                        />
                    );
                })}

                <circle cx={pointPosition.x} cy={pointPosition.y} r="6" fill="red" />

                {hoverTime !== null && (
                    <text x={hoverPosition.x + 5} y={hoverPosition.y - 5} fontSize="12" fill="black">
                        {formatTime(hoverTime)}
                    </text>
                )}
            </svg>
        </div>
    );
};

// Convert mouse event coordinates to SVG viewBox coordinates
const getSVGCoords = (event, svgElement) => {
    const ctm = svgElement.getScreenCTM();
    if (!ctm) return { offsetX: event.clientX, offsetY: event.clientY };

    const point = svgElement.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformedPoint = point.matrixTransform(ctm.inverse());

    return { offsetX: transformedPoint.x, offsetY: transformedPoint.y };
};

// Calculate progress point position
const calculatePointPosition = (points, progressRatio) => {
    if (!points || points.length === 0 || isNaN(progressRatio) || progressRatio < 0 || progressRatio > 1) {
        return { x: 0, y: 0 };
    }

    const segmentProgress = progressRatio * (points.length - 1);
    const segmentIndex = Math.floor(segmentProgress);

    if (segmentIndex >= points.length - 1) return points[points.length - 1];

    const p1 = points[segmentIndex] || points[points.length - 1];
    const p2 = points[segmentIndex + 1] || points[points.length - 1];

    return {
        x: p1.x + (p2.x - p1.x) * (segmentProgress - segmentIndex),
        y: p1.y + (p2.y - p1.y) * (segmentProgress - segmentIndex)
    };
};

// Find the closest progress point
const findClosestProgress = (points, clickPoint, duration) => {
    const maxDistance = 50;
    let closestCandidates = [];

    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        const v1 = subtract([clickPoint.x, clickPoint.y], [p1.x, p1.y]);
        const v2 = subtract([p2.x, p2.y], [p1.x, p1.y]);
        const segmentLength = norm(v2);

        let t = dot(v1, v2) / (segmentLength * segmentLength);
        t = Math.max(0, Math.min(1, t));

        const proj = add([p1.x, p1.y], multiply(t, v2));
        const projPoint = { x: proj[0], y: proj[1] };
        const distToProjection = norm(subtract([clickPoint.x, clickPoint.y], proj));

        if (distToProjection <= maxDistance) {
            closestCandidates.push({ dist: distToProjection, point: projPoint, ratio: i + t });
        }
    }

    if (closestCandidates.length === 0) {
        return { time: null, closestPoint: null };
    }

    closestCandidates.sort((a, b) => a.dist - b.dist);
    const bestMatch = closestCandidates[0];

    return { time: (bestMatch.ratio / (points.length - 1)) * duration, closestPoint: bestMatch.point };
};

const styles = {
    progressContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "80vh",
    }
};

export default ProgressBar;
