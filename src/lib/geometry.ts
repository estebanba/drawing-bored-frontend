/**
 * TypeScript Geometry Engine inspired by the Euclid F# library
 * Provides core geometric primitives and operations for educational purposes
 * All types are immutable and follow functional programming principles
 */

/**
 * Tolerance for floating point comparisons
 * Used throughout the library to handle floating point precision issues
 */
export const ZERO_TOLERANCE = 1e-9;

/**
 * Represents a 2D point with X and Y coordinates
 * Immutable data structure for representing positions in 2D space
 */
export class Point2D {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {
    // Validate input to prevent NaN or Infinity values
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error(`Invalid Point2D coordinates: x=${x}, y=${y}`);
    }
  }

  /**
   * Add a vector to this point, returning a new translated point
   * @param vector Vector to add to this point
   * @returns New Point2D at the translated position
   */
  add(vector: Vector2D): Point2D {
    return new Point2D(this.x + vector.x, this.y + vector.y);
  }

  /**
   * Subtract another point from this point, returning the vector between them
   * @param other Other point to subtract
   * @returns Vector from other point to this point
   */
  subtract(other: Point2D): Vector2D {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }

  /**
   * Calculate the Euclidean distance to another point
   * @param other Other point to measure distance to
   * @returns Distance between the two points
   */
  distanceTo(other: Point2D): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculate the squared distance to another point (faster when only comparing distances)
   * @param other Other point to measure squared distance to
   * @returns Squared distance between the two points
   */
  distanceSquaredTo(other: Point2D): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return dx * dx + dy * dy;
  }

  /**
   * Scale this point by a factor from the origin
   * @param factor Scaling factor
   * @returns New scaled point
   */
  scale(factor: number): Point2D {
    return new Point2D(this.x * factor, this.y * factor);
  }

  /**
   * Check if this point is approximately equal to another point
   * @param other Other point to compare
   * @param tolerance Tolerance for comparison (default: ZERO_TOLERANCE)
   * @returns True if points are approximately equal
   */
  equals(other: Point2D, tolerance: number = ZERO_TOLERANCE): boolean {
    if (!other || typeof other !== 'object') {
      return false;
    }
    return Math.abs(this.x - other.x) < tolerance && Math.abs(this.y - other.y) < tolerance;
  }

  /**
   * Convert point to string representation
   * @returns String representation of the point
   */
  toString(): string {
    return `Point2D(${this.x.toFixed(3)}, ${this.y.toFixed(3)})`;
  }

  // Static factory methods for common points
  static readonly ORIGIN = new Point2D(0, 0);
  static readonly UNIT_X = new Point2D(1, 0);
  static readonly UNIT_Y = new Point2D(0, 1);
}

/**
 * Represents a 2D vector with X and Y components
 * Immutable data structure for representing directions and displacements
 */
export class Vector2D {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error(`Invalid Vector2D components: x=${x}, y=${y}`);
    }
  }

  /**
   * Calculate the magnitude (length) of this vector
   * @returns The magnitude of the vector
   */
  get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Calculate the squared magnitude of this vector (faster for comparisons)
   * @returns The squared magnitude of the vector
   */
  get magnitudeSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Get a unit vector in the same direction (normalized vector)
   * @returns Unit vector in the same direction
   * @throws Error if the vector has zero length
   */
  get unitized(): UnitVector2D {
    return UnitVector2D.fromVector(this);
  }

  /**
   * Get a regular Vector2D unit vector (for backward compatibility)
   * @returns Vector2D unit vector in the same direction
   * @throws Error if the vector has zero length
   */
  get unitVector(): Vector2D {
    const mag = this.magnitude;
    if (mag < ZERO_TOLERANCE) {
      throw new Error('Cannot unitize zero-length vector');
    }
    return new Vector2D(this.x / mag, this.y / mag);
  }

  /**
   * Check if this is approximately a unit vector
   * @param tolerance Tolerance for comparison
   * @returns True if this is approximately a unit vector
   */
  get isUnit(): boolean {
    return Math.abs(this.magnitude - 1.0) < ZERO_TOLERANCE;
  }

  /**
   * Add another vector to this vector
   * @param other Vector to add
   * @returns New vector representing the sum
   */
  add(other: Vector2D): Vector2D {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  /**
   * Subtract another vector from this vector
   * @param other Vector to subtract
   * @returns New vector representing the difference
   */
  subtract(other: Vector2D): Vector2D {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }

  /**
   * Scale this vector by a scalar factor
   * @param factor Scaling factor
   * @returns New scaled vector
   */
  scale(factor: number): Vector2D {
    return new Vector2D(this.x * factor, this.y * factor);
  }

  /**
   * Calculate the dot product with another vector
   * @param other Other vector for dot product
   * @returns Dot product result
   */
  dot(other: Vector2D): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Calculate the cross product magnitude with another vector (2D cross product)
   * @param other Other vector for cross product
   * @returns Cross product magnitude (positive if counterclockwise)
   */
  cross(other: Vector2D): number {
    return this.x * other.y - this.y * other.x;
  }

  /**
   * Calculate the angle between this vector and another vector in radians
   * @param other Other vector to measure angle to
   * @returns Angle in radians between the vectors
   */
  angleTo(other: Vector2D): number {
    const dotProduct = this.dot(other);
    const magnitudes = this.magnitude * other.magnitude;
    if (magnitudes < ZERO_TOLERANCE) {
      throw new Error('Cannot calculate angle with zero-length vector');
    }
    return Math.acos(Math.max(-1, Math.min(1, dotProduct / magnitudes)));
  }

  /**
   * Get a vector perpendicular to this one (rotated 90 degrees counterclockwise)
   * @returns Perpendicular vector
   */
  get perpendicular(): Vector2D {
    return new Vector2D(-this.y, this.x);
  }

  /**
   * Rotate this vector by an angle in radians
   * @param angleRadians Angle to rotate by in radians
   * @returns New rotated vector
   */
  rotate(angleRadians: number): Vector2D {
    const cos = Math.cos(angleRadians);
    const sin = Math.sin(angleRadians);
    return new Vector2D(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  /**
   * Check if this vector is approximately equal to another vector
   * @param other Other vector to compare
   * @param tolerance Tolerance for comparison
   * @returns True if vectors are approximately equal
   */
  equals(other: Vector2D, tolerance: number = ZERO_TOLERANCE): boolean {
    if (!other || typeof other !== 'object') {
      return false;
    }
    return Math.abs(this.x - other.x) < tolerance && Math.abs(this.y - other.y) < tolerance;
  }

  /**
   * Convert vector to string representation
   * @returns String representation of the vector
   */
  toString(): string {
    return `Vector2D(${this.x.toFixed(3)}, ${this.y.toFixed(3)})`;
  }

  // Static factory methods for common vectors
  static readonly ZERO = new Vector2D(0, 0);
  static readonly UNIT_X = new Vector2D(1, 0);
  static readonly UNIT_Y = new Vector2D(0, 1);
}

/**
 * Represents a 2D line segment with start and end points
 * Immutable data structure for representing finite line segments
 */
export class Line2D {
  constructor(
    public readonly start: Point2D,
    public readonly end: Point2D
  ) {
    // Validate that start and end are different points
    if (start.equals(end)) {
      throw new Error('Line2D start and end points cannot be the same');
    }
  }

  /**
   * Get the length of this line segment
   * @returns Length of the line segment
   */
  get length(): number {
    return this.start.distanceTo(this.end);
  }

  /**
   * Get the direction vector of this line segment
   * @returns Vector from start to end point
   */
  get direction(): Vector2D {
    return this.end.subtract(this.start);
  }

  /**
   * Get the unit direction vector of this line segment
   * @returns Unit vector in the direction of the line
   */
  get unitDirection(): Vector2D {
    return this.direction.unitized.toVector();
  }

  /**
   * Get the midpoint of this line segment
   * @returns Point at the center of the line segment
   */
  get midpoint(): Point2D {
    return new Point2D(
      (this.start.x + this.end.x) / 2,
      (this.start.y + this.end.y) / 2
    );
  }

  /**
   * Evaluate a point along the line using a parameter t
   * @param t Parameter value (0 = start, 1 = end)
   * @returns Point at parameter t along the line
   */
  evaluateAt(t: number): Point2D {
    return new Point2D(
      this.start.x + t * (this.end.x - this.start.x),
      this.start.y + t * (this.end.y - this.start.y)
    );
  }

  /**
   * Calculate the shortest distance from a point to this line segment
   * @param point Point to measure distance from
   * @returns Shortest distance to the line segment
   */
  distanceToPoint(point: Point2D): number {
    const A = point.subtract(this.start);
    const B = this.end.subtract(this.start);
    const lengthSquared = B.magnitudeSquared;
    
    if (lengthSquared < ZERO_TOLERANCE) {
      return point.distanceTo(this.start);
    }

    const t = Math.max(0, Math.min(1, A.dot(B) / lengthSquared));
    const closestPoint = this.evaluateAt(t);
    return point.distanceTo(closestPoint);
  }

  /**
   * Get the closest point on this line segment to a given point
   * @param point Point to find closest point to
   * @returns Closest point on the line segment
   */
  closestPointTo(point: Point2D): Point2D {
    const A = point.subtract(this.start);
    const B = this.end.subtract(this.start);
    const lengthSquared = B.magnitudeSquared;
    
    if (lengthSquared < ZERO_TOLERANCE) {
      return this.start;
    }

    const t = Math.max(0, Math.min(1, A.dot(B) / lengthSquared));
    return this.evaluateAt(t);
  }

  /**
   * Convert line to string representation
   * @returns String representation of the line
   */
  toString(): string {
    return `Line2D(${this.start.toString()} -> ${this.end.toString()})`;
  }
}

/**
 * Represents a 2D circle with center point and radius
 * Immutable data structure for representing circles
 */
export class Circle2D {
  constructor(
    public readonly center: Point2D,
    public readonly radius: number
  ) {
    if (radius <= 0) {
      throw new Error(`Circle radius must be positive, got: ${radius}`);
    }
  }

  /**
   * Get the area of this circle
   * @returns Area of the circle
   */
  get area(): number {
    return Math.PI * this.radius * this.radius;
  }

  /**
   * Get the circumference of this circle
   * @returns Circumference of the circle
   */
  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  /**
   * Check if a point is inside this circle
   * @param point Point to check
   * @returns True if point is inside the circle
   */
  contains(point: Point2D): boolean {
    return this.center.distanceSquaredTo(point) <= this.radius * this.radius;
  }

  /**
   * Check if a point is on the circumference of this circle
   * @param point Point to check
   * @param tolerance Tolerance for comparison
   * @returns True if point is on the circumference
   */
  isOnCircumference(point: Point2D, tolerance: number = ZERO_TOLERANCE): boolean {
    const distance = this.center.distanceTo(point);
    return Math.abs(distance - this.radius) < tolerance;
  }

  /**
   * Get a point on the circle at a given angle
   * @param angleRadians Angle in radians from positive X-axis
   * @returns Point on the circle at the specified angle
   */
  pointAt(angleRadians: number): Point2D {
    return new Point2D(
      this.center.x + this.radius * Math.cos(angleRadians),
      this.center.y + this.radius * Math.sin(angleRadians)
    );
  }

  /**
   * Convert circle to string representation
   * @returns String representation of the circle
   */
  toString(): string {
    return `Circle2D(center: ${this.center.toString()}, radius: ${this.radius.toFixed(3)})`;
  }
}

/**
 * Utility functions for geometric calculations
 * Collection of common geometric algorithms and operations
 */
export class GeometryUtils {
  /**
   * Calculate the angle of a vector from the positive X-axis
   * @param vector Vector to calculate angle for
   * @returns Angle in radians from positive X-axis
   */
  static vectorAngle(vector: Vector2D): number {
    return Math.atan2(vector.y, vector.x);
  }

  /**
   * Convert degrees to radians
   * @param degrees Angle in degrees
   * @returns Angle in radians
   */
  static degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  /**
   * Convert radians to degrees
   * @param radians Angle in radians
   * @returns Angle in degrees
   */
  static radiansToDegrees(radians: number): number {
    return radians * 180 / Math.PI;
  }

  /**
   * Find the intersection point of two infinite lines (if they intersect)
   * @param line1 First line
   * @param line2 Second line
   * @returns Intersection point or null if lines are parallel
   */
  static lineIntersection(line1: Line2D, line2: Line2D): Point2D | null {
    const d1 = line1.direction;
    const d2 = line2.direction;
    const denominator = d1.cross(d2);
    
    if (Math.abs(denominator) < ZERO_TOLERANCE) {
      return null; // Lines are parallel
    }

    const startDiff = line2.start.subtract(line1.start);
    const t = startDiff.cross(d2) / denominator;
    
    return line1.evaluateAt(t);
  }

  /**
   * Find the intersection point of two line segments (if they intersect within their bounds)
   * @param line1 First line segment
   * @param line2 Second line segment
   * @returns Intersection point or null if segments don't intersect
   */
  static lineSegmentIntersection(line1: Line2D, line2: Line2D): Point2D | null {
    const intersection = GeometryUtils.lineIntersection(line1, line2);
    if (!intersection) return null;

    // Check if intersection point is within both line segments
    const t1 = GeometryUtils.getParameterOnLine(line1, intersection);
    const t2 = GeometryUtils.getParameterOnLine(line2, intersection);
    
    if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
      return intersection;
    }
    
    return null;
  }

  /**
   * Find intersection points between a line and a circle
   * @param line Line to intersect with circle
   * @param circle Circle to intersect with line
   * @returns Array of intersection points (0, 1, or 2 points)
   */
  static lineCircleIntersection(line: Line2D, circle: Circle2D): Point2D[] {
    const intersections: Point2D[] = [];
    
    // Vector from line start to circle center
    const startToCenter = circle.center.subtract(line.start);
    const lineDirection = line.direction;
    const lineLength = lineDirection.magnitude;
    const unitDirection = lineDirection.unitized;
    
    // Project circle center onto the line
    const projectionLength = startToCenter.dot(unitDirection.toVector());
    const projectionPoint = line.start.add(unitDirection.scale(projectionLength));
    
    // Distance from circle center to the line
    const distanceToLine = circle.center.distanceTo(projectionPoint);
    
    // No intersection if circle is too far from line
    if (distanceToLine > circle.radius + ZERO_TOLERANCE) {
      return intersections;
    }
    
    // Tangent case (one intersection)
    if (Math.abs(distanceToLine - circle.radius) < ZERO_TOLERANCE) {
      // Check if intersection is within line segment bounds
      const t = projectionLength / lineLength;
      if (t >= 0 && t <= 1) {
        intersections.push(projectionPoint);
      }
      return intersections;
    }
    
    // Two intersections case
    const halfChordLength = Math.sqrt(circle.radius * circle.radius - distanceToLine * distanceToLine);
    
    const intersection1 = projectionPoint.add(unitDirection.scale(-halfChordLength));
    const intersection2 = projectionPoint.add(unitDirection.scale(halfChordLength));
    
    // Check if intersections are within line segment bounds
    const t1 = (projectionLength - halfChordLength) / lineLength;
    const t2 = (projectionLength + halfChordLength) / lineLength;
    
    if (t1 >= 0 && t1 <= 1) {
      intersections.push(intersection1);
    }
    if (t2 >= 0 && t2 <= 1) {
      intersections.push(intersection2);
    }
    
    return intersections;
  }

  /**
   * Find intersection points between two circles
   * @param circle1 First circle
   * @param circle2 Second circle
   * @returns Array of intersection points (0, 1, or 2 points)
   */
  static circleCircleIntersection(circle1: Circle2D, circle2: Circle2D): Point2D[] {
    const intersections: Point2D[] = [];
    
    const centerDistance = circle1.center.distanceTo(circle2.center);
    const r1 = circle1.radius;
    const r2 = circle2.radius;
    
    // No intersection if circles are too far apart or one is inside the other
    if (centerDistance > r1 + r2 + ZERO_TOLERANCE || 
        centerDistance < Math.abs(r1 - r2) - ZERO_TOLERANCE) {
      return intersections;
    }
    
    // Circles are identical (infinite intersections)
    if (centerDistance < ZERO_TOLERANCE && Math.abs(r1 - r2) < ZERO_TOLERANCE) {
      return intersections; // Return empty array for infinite intersections
    }
    
    // One intersection (circles are tangent)
    if (Math.abs(centerDistance - (r1 + r2)) < ZERO_TOLERANCE || 
        Math.abs(centerDistance - Math.abs(r1 - r2)) < ZERO_TOLERANCE) {
      const direction = circle2.center.subtract(circle1.center).unitized;
      const intersectionPoint = circle1.center.add(direction.scale(r1));
      intersections.push(intersectionPoint);
      return intersections;
    }
    
    // Two intersections
    const a = (r1 * r1 - r2 * r2 + centerDistance * centerDistance) / (2 * centerDistance);
    const h = Math.sqrt(r1 * r1 - a * a);
    
    const centerDirection = circle2.center.subtract(circle1.center).unitized;
    const midpoint = circle1.center.add(centerDirection.scale(a));
    const perpendicular = centerDirection.perpendicular;
    
    const intersection1 = midpoint.add(perpendicular.scale(h));
    const intersection2 = midpoint.add(perpendicular.scale(-h));
    
    intersections.push(intersection1, intersection2);
    return intersections;
  }

  /**
   * Find all intersection points between geometric elements
   * @param element1 First geometric element
   * @param element2 Second geometric element
   * @returns Array of intersection points
   */
  static findIntersections(
    element1: { type: string; data: Point2D | Line2D | Circle2D },
    element2: { type: string; data: Point2D | Line2D | Circle2D }
  ): Point2D[] {
    if (element1.type === 'line' && element2.type === 'line') {
      const intersection = GeometryUtils.lineSegmentIntersection(
        element1.data as Line2D, 
        element2.data as Line2D
      );
      return intersection ? [intersection] : [];
    }
    
    if (element1.type === 'line' && element2.type === 'circle') {
      return GeometryUtils.lineCircleIntersection(
        element1.data as Line2D, 
        element2.data as Circle2D
      );
    }
    
    if (element1.type === 'circle' && element2.type === 'line') {
      return GeometryUtils.lineCircleIntersection(
        element2.data as Line2D, 
        element1.data as Circle2D
      );
    }
    
    if (element1.type === 'circle' && element2.type === 'circle') {
      return GeometryUtils.circleCircleIntersection(
        element1.data as Circle2D, 
        element2.data as Circle2D
      );
    }
    
    return [];
  }

  /**
   * Calculate the perpendicular bisector of a line segment
   * @param line Line segment to create perpendicular bisector for
   * @param length Length of the perpendicular bisector line
   * @returns Line representing the perpendicular bisector
   */
  static perpendicularBisector(line: Line2D, length: number = 100): Line2D {
    const midpoint = line.midpoint;
    const perpDirection = line.direction.perpendicular.unitized.scale(length / 2);
    
    return new Line2D(
      midpoint.add(perpDirection.scale(-1)),
      midpoint.add(perpDirection)
    );
  }

  /**
   * Create a circle that passes through three points
   * @param p1 First point
   * @param p2 Second point
   * @param p3 Third point
   * @returns Circle through the three points or null if points are collinear
   */
  static circleThrough3Points(p1: Point2D, p2: Point2D, p3: Point2D): Circle2D | null {
    // Calculate the center using perpendicular bisectors
    const line1 = new Line2D(p1, p2);
    const line2 = new Line2D(p2, p3);
    
    const bisector1 = GeometryUtils.perpendicularBisector(line1);
    const bisector2 = GeometryUtils.perpendicularBisector(line2);
    
    const center = GeometryUtils.lineIntersection(bisector1, bisector2);
    if (!center) {
      return null; // Points are collinear
    }

    const radius = center.distanceTo(p1);
    return new Circle2D(center, radius);
  }

  /**
   * Check if two line segments intersect
   * @param line1 First line segment
   * @param line2 Second line segment
   * @returns True if the line segments intersect
   */
  static doLinesIntersect(line1: Line2D, line2: Line2D): boolean {
    return GeometryUtils.lineSegmentIntersection(line1, line2) !== null;
  }

  /**
   * Get the parameter t for a point on a line (0 = start, 1 = end)
   * @param line Line to check
   * @param point Point on the line
   * @returns Parameter t value
   */
  private static getParameterOnLine(line: Line2D, point: Point2D): number {
    const direction = line.direction;
    const pointVector = point.subtract(line.start);
    
    if (Math.abs(direction.x) > Math.abs(direction.y)) {
      return pointVector.x / direction.x;
    } else {
      return pointVector.y / direction.y;
    }
  }

  /**
   * Find all intersection points in a collection of geometric elements
   * @param elements Array of geometric elements to find intersections between
   * @returns Array of intersection points with metadata
   */
  static findAllIntersections(
    elements: Array<{ id: string; type: string; data: Point2D | Line2D | Circle2D }>
  ): Array<{ point: Point2D; elements: string[]; type: string }> {
    const intersections: Array<{ point: Point2D; elements: string[]; type: string }> = [];
    
    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        const element1 = elements[i];
        const element2 = elements[j];
        
        // Skip if both elements are points
        if (element1.type === 'point' && element2.type === 'point') continue;
        
        const intersectionPoints = GeometryUtils.findIntersections(element1, element2);
        
        intersectionPoints.forEach(point => {
          // Check if this intersection already exists (within tolerance)
          const existingIntersection = intersections.find(existing => 
            existing.point.equals(point, ZERO_TOLERANCE * 10)
          );
          
          if (existingIntersection) {
            // Add elements to existing intersection
            if (!existingIntersection.elements.includes(element1.id)) {
              existingIntersection.elements.push(element1.id);
            }
            if (!existingIntersection.elements.includes(element2.id)) {
              existingIntersection.elements.push(element2.id);
            }
          } else {
            // Create new intersection
            const intersectionType = `${element1.type}-${element2.type}`;
            intersections.push({
              point,
              elements: [element1.id, element2.id],
              type: intersectionType
            });
          }
        });
      }
    }
    
    return intersections;
  }
}

/**
 * Represents a 2D unit vector (guaranteed to have magnitude 1)
 * Type-safe representation of normalized vectors, inspired by Euclid F# library
 * Provides compile-time guarantee that the vector is normalized
 */
export class UnitVector2D {
  private constructor(
    public readonly x: number,
    public readonly y: number
  ) {
    // Private constructor ensures only normalized vectors can be created
  }

  /**
   * Create a UnitVector2D from a regular vector (normalizes it)
   * @param vector Vector to normalize
   * @returns UnitVector2D in the same direction
   * @throws Error if the vector has zero length
   */
  static fromVector(vector: Vector2D): UnitVector2D {
    const mag = vector.magnitude;
    if (mag < ZERO_TOLERANCE) {
      throw new Error('Cannot create unit vector from zero-length vector');
    }
    return new UnitVector2D(vector.x / mag, vector.y / mag);
  }

  /**
   * Create a UnitVector2D from angle in radians
   * @param angleRadians Angle in radians
   * @returns UnitVector2D pointing in the specified direction
   */
  static fromAngle(angleRadians: number): UnitVector2D {
    return new UnitVector2D(Math.cos(angleRadians), Math.sin(angleRadians));
  }

  /**
   * Convert to regular Vector2D
   * @returns Vector2D with the same components
   */
  toVector(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  /**
   * Scale this unit vector by a factor (returns regular Vector2D)
   * @param factor Scaling factor
   * @returns New Vector2D scaled by the factor
   */
  scale(factor: number): Vector2D {
    return new Vector2D(this.x * factor, this.y * factor);
  }

  /**
   * Calculate the dot product with another unit vector
   * @param other Other unit vector for dot product
   * @returns Dot product result
   */
  dot(other: UnitVector2D): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Calculate the cross product magnitude with another unit vector
   * @param other Other unit vector for cross product
   * @returns Cross product magnitude (positive if counterclockwise)
   */
  cross(other: UnitVector2D): number {
    return this.x * other.y - this.y * other.x;
  }

  /**
   * Get the perpendicular unit vector (rotated 90 degrees counterclockwise)
   * @returns Perpendicular unit vector
   */
  get perpendicular(): UnitVector2D {
    return new UnitVector2D(-this.y, this.x);
  }

  /**
   * Rotate this unit vector by an angle
   * @param angleRadians Angle to rotate by (in radians)
   * @returns New rotated unit vector
   */
  rotate(angleRadians: number): UnitVector2D {
    const cos = Math.cos(angleRadians);
    const sin = Math.sin(angleRadians);
    return new UnitVector2D(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  /**
   * Calculate the angle to another unit vector
   * @param other Other unit vector
   * @returns Angle between vectors in radians [0, π]
   */
  angleTo(other: UnitVector2D): number {
    // Using atan2 for better numerical stability
    return Math.atan2(this.cross(other), this.dot(other));
  }

  /**
   * Check if this unit vector is approximately equal to another
   * @param other Other unit vector to compare
   * @param tolerance Tolerance for comparison (default: ZERO_TOLERANCE)
   * @returns True if unit vectors are approximately equal
   */
  equals(other: UnitVector2D, tolerance: number = ZERO_TOLERANCE): boolean {
    return Math.abs(this.x - other.x) < tolerance && Math.abs(this.y - other.y) < tolerance;
  }

  /**
   * Convert to string representation
   * @returns String representation of the unit vector
   */
  toString(): string {
    return `UnitVector2D(${this.x.toFixed(3)}, ${this.y.toFixed(3)})`;
  }

  // Static unit vectors for common directions
  static readonly UNIT_X = new UnitVector2D(1, 0);
  static readonly UNIT_Y = new UnitVector2D(0, 1);
  static readonly UNIT_MINUS_X = new UnitVector2D(-1, 0);
  static readonly UNIT_MINUS_Y = new UnitVector2D(0, -1);
}

/**
 * Represents a cog wheel (gear) shape
 * Educational tool for mechanical engineering and design concepts
 */
export class CogWheel {
  constructor(
    public readonly center: Point2D,
    public readonly outerRadius: number,
    public readonly innerRadius: number = outerRadius * 0.6,
    public readonly teethCount: number = 12
  ) {}

  /**
   * Generate the points that define the cog wheel outline
   * Returns an array of points that form the gear teeth profile
   */
  generatePoints(): Point2D[] {
    const points: Point2D[] = []
    const angleStep = (2 * Math.PI) / this.teethCount
    
    for (let i = 0; i < this.teethCount; i++) {
      const baseAngle = i * angleStep
      
      // Each tooth has 4 points: outer base, outer tip, outer base, inner valley
      const angles = [
        baseAngle - angleStep * 0.2,  // Outer base (left)
        baseAngle - angleStep * 0.1,  // Outer tip (left)
        baseAngle + angleStep * 0.1,  // Outer tip (right)
        baseAngle + angleStep * 0.2,  // Outer base (right)
      ]
      
      const radii = [
        this.outerRadius * 0.9,  // Outer base
        this.outerRadius,        // Outer tip
        this.outerRadius,        // Outer tip
        this.outerRadius * 0.9,  // Outer base
      ]
      
      // Add the tooth points
      for (let j = 0; j < angles.length; j++) {
        const x = this.center.x + Math.cos(angles[j]) * radii[j]
        const y = this.center.y + Math.sin(angles[j]) * radii[j]
        points.push(new Point2D(x, y))
      }
      
      // Add inner valley points
      const valleyAngle1 = baseAngle + angleStep * 0.2
      const valleyAngle2 = baseAngle + angleStep * 0.8
      
      const valleyX1 = this.center.x + Math.cos(valleyAngle1) * this.innerRadius
      const valleyY1 = this.center.y + Math.sin(valleyAngle1) * this.innerRadius
      points.push(new Point2D(valleyX1, valleyY1))
      
      const valleyX2 = this.center.x + Math.cos(valleyAngle2) * this.innerRadius
      const valleyY2 = this.center.y + Math.sin(valleyAngle2) * this.innerRadius
      points.push(new Point2D(valleyX2, valleyY2))
    }
    
    return points
  }

  /**
   * Generate path data for SVG rendering
   */
  toSVGPath(): string {
    const points = this.generatePoints()
    if (points.length === 0) return ''
    
    let path = `M ${points[0].x},${points[0].y}`
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x},${points[i].y}`
    }
    
    path += ' Z' // Close the path
    return path
  }

  /**
   * Get the center hole circle for the cog wheel
   */
  getCenterHole(): Circle2D {
    return new Circle2D(this.center, this.innerRadius * 0.3)
  }

  /**
   * Check if a point is inside the cog wheel
   */
  containsPoint(point: Point2D): boolean {
    const distance = this.center.distanceTo(point)
    return distance <= this.outerRadius && distance >= this.innerRadius * 0.3
  }

  /**
   * Get bounding box of the cog wheel
   */
  getBounds(): { min: Point2D; max: Point2D } {
    return {
      min: new Point2D(this.center.x - this.outerRadius, this.center.y - this.outerRadius),
      max: new Point2D(this.center.x + this.outerRadius, this.center.y + this.outerRadius)
    }
  }

  /**
   * Create a string representation
   */
  toString(): string {
    return `CogWheel(center: ${this.center.toString()}, outerRadius: ${this.outerRadius.toFixed(2)}, teeth: ${this.teethCount})`
  }

  /**
   * Check equality with another cog wheel
   */
  equals(other: CogWheel): boolean {
    return this.center.equals(other.center) && 
           Math.abs(this.outerRadius - other.outerRadius) < ZERO_TOLERANCE &&
           Math.abs(this.innerRadius - other.innerRadius) < ZERO_TOLERANCE &&
           this.teethCount === other.teethCount
  }
} 