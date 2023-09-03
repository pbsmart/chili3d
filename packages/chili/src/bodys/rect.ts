// Copyright 2022-2023 the Chili authors. All rights reserved. MPL-2.0 license.

import {
    ClassMap,
    FaceableBody,
    I18nKeys,
    IDocument,
    IShape,
    Plane,
    Property,
    Result,
    Serializer,
    XYZ,
} from "chili-core";

@ClassMap.key("RectBody")
export class RectBody extends FaceableBody {
    readonly name: I18nKeys = "body.rect";

    private _dx: number;
    @Serializer.property("constructor")
    @Property.define("rect.dx")
    get dx() {
        return this._dx;
    }
    set dx(dx: number) {
        this.setPropertyAndUpdate("dx", dx);
    }

    private _dy: number;
    @Serializer.property("constructor")
    @Property.define("rect.dy")
    get dy() {
        return this._dy;
    }
    set dy(dy: number) {
        this.setPropertyAndUpdate("dy", dy);
    }

    private _plane: Plane;
    @Serializer.property("constructor")
    get plane() {
        return this._plane;
    }

    constructor(document: IDocument, plane: Plane, dx: number, dy: number) {
        super(document);
        this._plane = plane;
        this._dx = dx;
        this._dy = dy;
    }

    @Serializer.deserializer()
    static from({ document, plane, dx, dy }: { document: IDocument; plane: Plane; dx: number; dy: number }) {
        return new RectBody(document, plane, dx, dy);
    }

    protected generateShape(): Result<IShape, string> {
        let points = RectBody.points(this.plane, this._dx, this._dy);
        let wire = this.shapeFactory.polygon(...points);
        if (!wire.success || !this.isFace) return wire;
        return wire.value.toFace();
    }

    static points(plane: Plane, dx: number, dy: number): XYZ[] {
        let start = plane.origin;
        return [
            start,
            start.add(plane.xvec.multiply(dx)),
            start.add(plane.xvec.multiply(dx)).add(plane.yvec.multiply(dy)),
            start.add(plane.yvec.multiply(dy)),
            start,
        ];
    }
}
