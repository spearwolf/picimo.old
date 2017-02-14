/* global describe */
/* global it */
import { expect } from 'chai';
import NodeState from '../../src/graph/node_state';

describe("NodeState", function () {

    it("should be a constructor", function () {
        expect(typeof NodeState).to.equal('function');
    });

    it("should have a 'value' property", function () {
        let ns = new NodeState;
        expect('value' in ns).to.be.ok;
    });

    it("should have a 'is' method", function () {
        let ns = new NodeState;
        expect(typeof ns.is).to.equal('function');
    });

    it("should have a 'isNot' method", function () {
        let ns = new NodeState;
        expect(typeof ns.isNot).to.equal('function');
    });

    it("should have a CREATE state", function () {
        let state = NodeState.CREATE;
        expect(state).to.not.be.undefined;
        let ns = new NodeState(state);
        expect(ns.toString()).to.equal('[CREATE]');
    });

    it("should have a INIT state", function () {
        let state = NodeState.INIT;
        expect(state).to.not.be.undefined;
        let ns = new NodeState(state);
        expect(ns.toString()).to.equal('[INIT]');
    });

    it("should have a READY state", function () {
        let state = NodeState.READY;
        expect(state).to.not.be.undefined;
        let ns = new NodeState(state);
        expect(ns.toString()).to.equal('[READY]');
    });

    it("should have a ERROR state", function () {
        let state = NodeState.ERROR;
        expect(state).to.not.be.undefined;
        let ns = new NodeState(state);
        expect(ns.toString()).to.equal('[ERROR]');
    });

    it("should have a DESTROYED state", function () {
        let state = NodeState.DESTROYED;
        expect(state).to.not.be.undefined;
        let ns = new NodeState(state);
        expect(ns.toString()).to.equal('[DESTROYED]');
    });

    it("should handle multiple states", function () {

        let ns = new NodeState;
        ns.set(NodeState.CREATE | NodeState.READY);

        expect(ns.is(NodeState.CREATE)).to.be.true;
        expect(ns.is(NodeState.INIT)).to.be.false;
        expect(ns.is(NodeState.READY)).to.be.true;
        expect(ns.isNot(NodeState.ERROR)).to.be.true;
        expect(ns.isNot(NodeState.DESTROYED)).to.be.true;

    });

    it("should have an initial blank state", function () {

        let ns = new NodeState;

        expect(ns.isNot(NodeState.CREATE)).to.be.true;
        expect(ns.isNot(NodeState.INIT)).to.be.true;
        expect(ns.isNot(NodeState.READY)).to.be.true;
        expect(ns.isNot(NodeState.ERROR)).to.be.true;
        expect(ns.isNot(NodeState.DESTROYED)).to.be.true;

    });

    it("should create a new instance when called without new", function () {

        let ns = NodeState(NodeState.READY);

        expect(ns instanceof NodeState).to.be.true;
        expect(ns.is(NodeState.READY)).to.be.true;
        expect(ns.isNot(NodeState.INIT)).to.be.true;

    });

});

