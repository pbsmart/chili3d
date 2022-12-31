// Copyright 2022-2023 the Chili authors. All rights reserved. MPL-2.0 license.

import { ICommand } from "../command";

let commandMap = new Map<string, new (...args: any[]) => ICommand>();

export interface CommandData {
    name: string;
    display: string;
    icon: string;
    helpText?: string;
    helpUrl?: string;
}

export function command<T extends { new (...args: any[]): ICommand }>(commandData: CommandData) {
    return (ctor: T) => {
        commandMap.set(commandData.name, ctor);
        ctor.prototype.data = commandData;
    };
}

export namespace CommandData {
    export function get(command: string | (new (...args: any[]) => ICommand)): CommandData | undefined {
        if (typeof command === "string") {
            let c = commandMap.get(command);
            return c?.prototype.data;
        } else {
            return command.prototype.data;
        }
    }
}
