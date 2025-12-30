import {
  Component,
  ComponentSlot,
  Connection,
  Node,
  Level,
} from '../../src/types/pipeflow';

describe('pipeflow types', () => {
  describe('Component', () => {
    it('creates a valid Component object', () => {
      const component: Component = {
        id: 'comp1',
        symbol: '×2',
        operation: 'multiply',
        operand: 2,
      };

      expect(component.id).toBe('comp1');
      expect(component.symbol).toBe('×2');
      expect(component.operation).toBe('multiply');
      expect(component.operand).toBe(2);
    });

    it('creates a Component with multiple input ports', () => {
      const component: Component = {
        id: 'comp2',
        symbol: '+',
        operation: 'add',
        inputPorts: 2,
      };

      expect(component.inputPorts).toBe(2);
    });
  });

  describe('ComponentSlot', () => {
    it('creates a valid ComponentSlot object', () => {
      const slot: ComponentSlot = {
        id: 'slot1',
        position: {x: 100, y: 200},
      };

      expect(slot.id).toBe('slot1');
      expect(slot.position.x).toBe(100);
      expect(slot.position.y).toBe(200);
    });

    it('creates a ComponentSlot with accepted components', () => {
      const slot: ComponentSlot = {
        id: 'slot2',
        position: {x: 150, y: 250},
        acceptedComponents: ['comp1', 'comp2'],
      };

      expect(slot.acceptedComponents).toEqual(['comp1', 'comp2']);
    });
  });

  describe('Connection', () => {
    it('creates a valid Connection object', () => {
      const connection: Connection = {
        id: 'conn1',
        from: 'input',
        to: 'slot1',
      };

      expect(connection.id).toBe('conn1');
      expect(connection.from).toBe('input');
      expect(connection.to).toBe('slot1');
    });

    it('creates a Connection with port specifications', () => {
      const connection: Connection = {
        id: 'conn2',
        from: 'slot1',
        to: 'slot2',
        fromPort: 0,
        toPort: 1,
      };

      expect(connection.fromPort).toBe(0);
      expect(connection.toPort).toBe(1);
    });
  });

  describe('Node (InputNode/OutputNode)', () => {
    it('creates a valid input Node object', () => {
      const inputNode: Node = {
        id: 'input',
        type: 'input',
        value: 1,
        position: {x: 50, y: 100},
      };

      expect(inputNode.type).toBe('input');
      expect(inputNode.value).toBe(1);
    });

    it('creates a valid output Node object', () => {
      const outputNode: Node = {
        id: 'output',
        type: 'output',
        value: 2,
        position: {x: 350, y: 400},
      };

      expect(outputNode.type).toBe('output');
      expect(outputNode.value).toBe(2);
    });
  });

  describe('Level', () => {
    it('creates a valid Level object', () => {
      const level: Level = {
        id: 1,
        inputValue: 1,
        goalValue: 2,
        slots: [
          {
            id: 'slot1',
            position: {x: 200, y: 300},
          },
        ],
        availableComponents: [
          {
            id: 'comp1',
            symbol: '×2',
            operation: 'multiply',
            operand: 2,
          },
        ],
        connections: [
          {id: 'conn1', from: 'input', to: 'slot1'},
          {id: 'conn2', from: 'slot1', to: 'output'},
        ],
      };

      expect(level.id).toBe(1);
      expect(level.inputValue).toBe(1);
      expect(level.goalValue).toBe(2);
      expect(level.slots).toHaveLength(1);
      expect(level.availableComponents).toHaveLength(1);
      expect(level.connections).toHaveLength(2);
    });
  });
});
