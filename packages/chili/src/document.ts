// Copyright 2022-2023 the Chili authors. All rights reserved. MPL-2.0 license.

import {
    Entity,
    Id,
    IDocument,
    ICollectionNode,
    IHistory,
    INode,
    IViewer,
    IVisualization,
    Observable,
    PubSub,
    NodeLinkedList,
} from "chili-core";
import { IVisualizationFactory } from "chili-vis";
import { Application } from "chili-core/src/application";

import { History } from "./history";
import { NodeCollection } from "./nodeCollection";
import { Viewer } from "./viewer";

export class Document extends Observable implements IDocument {
    private static readonly _documentMap: Map<string, IDocument> = new Map();

    private _currentNode?: ICollectionNode;
    readonly nodes: NodeCollection;
    readonly viewer: IViewer;
    readonly visualization: IVisualization;
    readonly history: IHistory;
    readonly rootNode: ICollectionNode;

    private constructor(name: string, factory: IVisualizationFactory, readonly id: string = Id.new()) {
        super();
        this._name = name;
        this.nodes = new NodeCollection(this);
        this.history = new History();
        this.viewer = new Viewer(this);
        this.rootNode = new NodeLinkedList(this, name);
        this.visualization = factory.create(this);

        PubSub.default.sub("redraw", () => this.viewer.redraw());
    }

    static create(name: string) {
        let doc = new Document(name, Application.instance.visualizationFactory);
        this.cacheDocument(doc);
        Application.instance.activeDocument = doc;
        return doc;
    }

    static get(id: string): IDocument | undefined {
        return this._documentMap.get(id);
    }

    private static cacheDocument(document: IDocument) {
        if (this._documentMap.has(document.id)) return;
        this._documentMap.set(document.id, document);
    }

    private _name: string;

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this.setProperty("name", name);
    }

    get currentNode(): ICollectionNode | undefined {
        return this._currentNode;
    }

    set currentNode(value: ICollectionNode | undefined) {
        this.setProperty("currentNode", value);
    }

    toJson() {
        return {
            id: this.id,
            name: this._name,
        };
    }

    static fromJson(data: any) {
        let document = new Document(data.name, data.id);
        // data.models.forEach(x => document.addModel(x))
        return document;
    }
}
