import * as tf from '@tensorflow/tfjs-core';
import { Point } from '../classes';
import { Dimensions, IDimensions } from '../classes/Dimensions';
export declare function isTensor(tensor: any, dim: number): boolean;
export declare function isTensor1D(tensor: any): tensor is tf.Tensor1D;
export declare function isTensor2D(tensor: any): tensor is tf.Tensor2D;
export declare function isTensor3D(tensor: any): tensor is tf.Tensor3D;
export declare function isTensor4D(tensor: any): tensor is tf.Tensor4D;
export declare function isFloat(num: number): boolean;
export declare function isEven(num: number): boolean;
export declare function round(num: number, prec?: number): number;
export declare function isDimensions(obj: any): boolean;
export declare function computeReshapedDimensions({ width, height }: IDimensions, inputSize: number): Dimensions;
export declare function getCenterPoint(pts: Point[]): Point;
export declare function range(num: number, start: number, step: number): number[];
export declare function isValidNumber(num: any): boolean;
export declare function isValidProbablitiy(num: any): boolean;
//# sourceMappingURL=index.d.ts.map