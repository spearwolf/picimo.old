'use strict';

const Picimo = require('../build/picimo');

describe("Picimo.graph.NodeState", function () {

    it("should be a constructor", function () {
        expect(typeof Picimo.graph.NodeState).toEqual('function');
    });

    it("should have a 'value' property", function () {
        let ns = new Picimo.graph.NodeState;
        expect('value' in ns).toBeTruthy();
    });

    it("should have a 'is' method", function () {
        let ns = new Picimo.graph.NodeState;
        expect(typeof ns.is).toEqual('function');
    });

    it("should have a 'isNot' method", function () {
        let ns = new Picimo.graph.NodeState;
        expect(typeof ns.isNot).toEqual('function');
    });

    it("should have a CREATE state", function () {
        let state = Picimo.graph.NodeState.CREATE;
        expect(state).toBeDefined();
        let ns = new Picimo.graph.NodeState(state);
        expect(ns.toString()).toEqual('[CREATE]');
    });

    it("should have a INIT state", function () {
        let state = Picimo.graph.NodeState.INIT;
        expect(state).toBeDefined();
        let ns = new Picimo.graph.NodeState(state);
        expect(ns.toString()).toEqual('[INIT]');
    });

    it("should have a READY state", function () {
        let state = Picimo.graph.NodeState.READY;
        expect(state).toBeDefined();
        let ns = new Picimo.graph.NodeState(state);
        expect(ns.toString()).toEqual('[READY]');
    });

    it("should have a ERROR state", function () {
        let state = Picimo.graph.NodeState.ERROR;
        expect(state).toBeDefined();
        let ns = new Picimo.graph.NodeState(state);
        expect(ns.toString()).toEqual('[ERROR]');
    });

    it("should have a DESTROYED state", function () {
        let state = Picimo.graph.NodeState.DESTROYED;
        expect(state).toBeDefined();
        let ns = new Picimo.graph.NodeState(state);
        expect(ns.toString()).toEqual('[DESTROYED]');
    });

    it("should handle multiple states", function () {

        let ns = new Picimo.graph.NodeState;
        ns.set(Picimo.graph.NodeState.CREATE | Picimo.graph.NodeState.READY);

        expect(ns.is(Picimo.graph.NodeState.CREATE)).toBeTruthy();
        expect(ns.is(Picimo.graph.NodeState.INIT)).toBeFalsy();
        expect(ns.is(Picimo.graph.NodeState.READY)).toBeTruthy();
        expect(ns.isNot(Picimo.graph.NodeState.ERROR)).toBeTruthy();
        expect(ns.isNot(Picimo.graph.NodeState.DESTROYED)).toBeTruthy();

    });

    it("should have an initial blank state", function () {

        let ns = new Picimo.graph.NodeState;

        expect(ns.isNot(Picimo.graph.NodeState.CREATE)).toBeTruthy();
        expect(ns.isNot(Picimo.graph.NodeState.INIT)).toBeTruthy();
        expect(ns.isNot(Picimo.graph.NodeState.READY)).toBeTruthy();
        expect(ns.isNot(Picimo.graph.NodeState.ERROR)).toBeTruthy();
        expect(ns.isNot(Picimo.graph.NodeState.DESTROYED)).toBeTruthy();

    });

    it("should create a new instance when called without new", function () {

        let ns = Picimo.graph.NodeState(Picimo.graph.NodeState.READY);

        expect(ns instanceof Picimo.graph.NodeState).toBeTruthy();
        expect(ns.is(Picimo.graph.NodeState.READY)).toBeTruthy();
        expect(ns.isNot(Picimo.graph.NodeState.INIT)).toBeTruthy();

    });

});

