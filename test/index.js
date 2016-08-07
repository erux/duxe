import { assert } from 'chai';
import Erux from '../src';

describe('Erux', () => {
  const reducerError = 'reducer to be a function';
  const { reducer, enhancer, on } = Erux;
  describe('reducer function to get a reducer', () => {
    it('should be a function', () => {
      assert.isFunction(reducer);
    });
    it('should take the correct number of arguments', () => {
      assert.strictEqual(reducer.length, 2);
    });
    it('should return identical state without any reducers', () => {
      const initialState = {};
      assert.strictEqual(reducer(initialState, {}), initialState);
    });
  });

  describe('enhancer function to get an enhancer', () => {
    it('should be a function', () => {
      assert.isFunction(enhancer);
    });
    it('should take the correct number of arguments', () => {
      assert.strictEqual(enhancer.length, 1);
    });
    it('should return a function', () => {
      assert.isFunction(enhancer());
    });
    it('should return a function taking the correct number of arguments', () => {
      assert.strictEqual(enhancer().length, 3);
    });
    it('should fail without proper reducer', () => {
      assert.throws(enhancer(), reducerError);
      assert.throws(() => enhancer()(''), reducerError);
      assert.throws(() => enhancer()([]), reducerError);
      assert.throws(() => enhancer()({}), reducerError);
    });
  });

  describe('on function to add a reducer for an action type', () => {
    it('should be a function', () => {
      assert.isFunction(on);
    });
    it('should take the correct number of arguments', () => {
      assert.strictEqual(on.length, 2);
    });
    it('should fail without type', () => {
      const typeError = 'Type is required';
      assert.throws(on, typeError);
      assert.throws(() => on(''), typeError);
      assert.throws(() => on([]), typeError);
      assert.throws(() => on({}), typeError);
    });
    it('should fail without reducer', () => {
      assert.throws(() => on(' '), reducerError);
    });
    describe('when called with a simple number reducer', () => {
      const PLUS_ONE = 'PLUS_ONE';
      on(PLUS_ONE, state => state + 1);
      it('should result in a correct reducer being available', () => {
        const reducedState = reducer(0, { type: PLUS_ONE });
        assert.strictEqual(reducedState, 1);
      });
    });
    describe('when called with a simple string reducer', () => {
      const CONCAT = 'CONCAT';
      on(CONCAT, state => state.concat('cat'));
      it('should result in a correct reducer being available', () => {
        const reducedState = reducer('', { type: CONCAT });
        assert.strictEqual(reducedState, 'cat');
      });
    });
    describe('when called with a simple object reducer', () => {
      const LOAD = 'LOAD';
      const pageToLoad = 'somePage.html';
      const loadReducer = (state, action) => ({
        ...state,
        loading: false,
        loaded: true,
        request: action.pageToLoad,
      });
      const initialState = { loading: true };
      const loadAction = { type: LOAD, pageToLoad };
      const expectedReducedState = {
        loading: false,
        loaded: true,
        request: pageToLoad,
      };
      on(LOAD, loadReducer);
      it('should result in a correct reducer being available', () => {
        const reducedState = reducer(initialState, loadAction);
        assert.deepEqual(reducedState, expectedReducedState);
      });
    });
  });
});
