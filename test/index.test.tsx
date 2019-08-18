import React from 'react';
import TestRenderer from 'react-test-renderer';
import Button from '../src';

describe('<Button />', () => {
  it('Should output a Button', () => {
    const component = TestRenderer.create(
      <Button type="danger">BUTTON</Button>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    if (tree) {
      expect(tree.type).toBe('button');
      expect(tree.props.className).toBe('w-btn w-btn-size-default w-btn-danger');
      expect(tree.children).toHaveLength(1);
      if (tree.children) {
        expect(tree.children[0].type).toBe('span');
        expect(tree.children[0].children).toEqual(['BUTTON']);
      }
    }
  });
});