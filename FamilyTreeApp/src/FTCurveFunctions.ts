import { CurveFunctions, Vec2 } from "nodeflow-lib";

export class FTCurveFunctions extends CurveFunctions {
  public calculateCurveAnchors(
    start: Vec2,
    end: Vec2,
    _startNodeCenter: Vec2,
    _endNodeCenter: Vec2,
  ) {
    const v = this.getVerticalCurve(start, end);
    const anchorStart = start.add(v);
    const anchorEnd = end.subtract(v);

    return { anchorStart, anchorEnd };
  }
}
