import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Svg, {Path, Circle, Line} from 'react-native-svg';
import {Level, Component, Position} from '../types/pipeflow';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const BOARD_WIDTH = SCREEN_WIDTH - 40;
const BOARD_HEIGHT = SCREEN_HEIGHT * 0.6;
const NODE_RADIUS = 30;
const COMPONENT_WIDTH = 80;
const COMPONENT_HEIGHT = 60;

// Level definitions
const createLevels = (): Level[] => {
  return [
    // Level 1: Simple multiplication
    {
      id: 1,
      inputValue: 1,
      goalValue: 2,
      slots: [
        {
          id: 'slot1',
          position: {x: BOARD_WIDTH / 2, y: BOARD_HEIGHT / 2},
        },
      ],
      availableComponents: [
        {id: 'comp1', symbol: '×2', operation: 'multiply', operand: 2},
      ],
      connections: [
        {id: 'conn1', from: 'input', to: 'slot1'},
        {id: 'conn2', from: 'slot1', to: 'output'},
      ],
    },
    // Level 2: Two operations in sequence
    {
      id: 2,
      inputValue: 1,
      goalValue: 3,
      slots: [
        {
          id: 'slot1',
          position: {x: BOARD_WIDTH / 2, y: BOARD_HEIGHT * 0.35},
        },
        {
          id: 'slot2',
          position: {x: BOARD_WIDTH / 2, y: BOARD_HEIGHT * 0.55},
        },
      ],
      availableComponents: [
        {id: 'comp1', symbol: '×2', operation: 'multiply', operand: 2},
        {id: 'comp2', symbol: '+1', operation: 'add', operand: 1},
      ],
      connections: [
        {id: 'conn1', from: 'input', to: 'slot1'},
        {id: 'conn2', from: 'slot1', to: 'slot2'},
        {id: 'conn3', from: 'slot2', to: 'output'},
      ],
    },
    // Level 3: Fan-out with multiple inputs
    {
      id: 3,
      inputValue: 1,
      goalValue: 3,
      slots: [
        {
          id: 'slot1',
          position: {x: BOARD_WIDTH * 0.3, y: BOARD_HEIGHT * 0.4},
          acceptedComponents: ['comp1'],
        },
        {
          id: 'slot2',
          position: {x: BOARD_WIDTH * 0.65, y: BOARD_HEIGHT * 0.55},
          acceptedComponents: ['comp2'],
        },
      ],
      availableComponents: [
        {id: 'comp1', symbol: '×2', operation: 'multiply', operand: 2},
        {id: 'comp2', symbol: '+', operation: 'add', inputPorts: 2},
      ],
      connections: [
        {id: 'conn1', from: 'input', to: 'slot1'},
        {id: 'conn2', from: 'input', to: 'slot2', toPort: 0},
        {id: 'conn3', from: 'slot1', to: 'slot2', toPort: 1},
        {id: 'conn4', from: 'slot2', to: 'output'},
      ],
    },
  ];
};

const PipeflowScreen = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [levels, setLevels] = useState<Level[]>(createLevels());
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null,
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const currentLevel = levels[currentLevelIndex];

  // Get components that haven't been placed yet
  const getAvailableComponents = useCallback(() => {
    const placedComponentIds = currentLevel.slots
      .map(slot => slot.placedComponent?.id)
      .filter(Boolean);
    return currentLevel.availableComponents.filter(
      comp => !placedComponentIds.includes(comp.id),
    );
  }, [currentLevel]);

  const handleComponentTap = useCallback(
    (component: Component) => {
      console.log('Component tapped:', component);

      // If a slot is selected, place the component there
      if (selectedSlot) {
        console.log('Placing component in selected slot:', selectedSlot);

        const newLevels = levels.map((level, idx) => {
          if (idx !== currentLevelIndex) return level;

          const newSlots = level.slots.map(s => {
            if (s.id !== selectedSlot) return s;

            const isAccepted =
              !s.acceptedComponents ||
              s.acceptedComponents.includes(component.id);

            if (isAccepted && !s.placedComponent) {
              return {
                ...s,
                placedComponent: {...component, slotId: s.id},
              };
            }
            return s;
          });

          return {
            ...level,
            slots: newSlots,
          };
        });

        setLevels(newLevels);
        setSelectedSlot(null);
        setSelectedComponent(null);
        return;
      }

      // Otherwise, toggle component selection
      setSelectedComponent(prev => {
        const newSelection = prev?.id === component.id ? null : component;
        console.log('New selected component:', newSelection);
        return newSelection;
      });
    },
    [selectedSlot, levels, currentLevelIndex],
  );

  const handleSlotTap = useCallback(
    (slotId: string) => {
      console.log('Slot tapped:', slotId);
      console.log('Selected component:', selectedComponent);

      const newLevels = levels.map((level, idx) => {
        if (idx !== currentLevelIndex) return level;

        const newSlots = level.slots.map(s => {
          if (s.id !== slotId) return s;

          // If slot has a component, remove it
          if (s.placedComponent) {
            console.log('Removing component from slot');
            return {
              ...s,
              placedComponent: undefined,
            };
          }

          // If a component is selected and slot is empty, place it
          if (selectedComponent) {
            const isAccepted =
              !s.acceptedComponents ||
              s.acceptedComponents.includes(selectedComponent.id);

            console.log('Is component accepted?', isAccepted);

            if (isAccepted) {
              console.log('Placing component in slot');
              return {
                ...s,
                placedComponent: {...selectedComponent, slotId: s.id},
              };
            }
          } else {
            // No component selected, so select this slot
            console.log('Selecting slot for component placement');
            setSelectedSlot(slotId);
          }

          return s;
        });

        return {
          ...level,
          slots: newSlots,
        };
      });

      console.log('Setting new levels');
      setLevels(newLevels);
      if (selectedComponent) {
        setSelectedComponent(null);
        setSelectedSlot(null);
      }
    },
    [selectedComponent, levels, currentLevelIndex],
  );

  const nextLevel = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    }
  };

  const prevLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(currentLevelIndex - 1);
    }
  };

  const renderCurvedPipe = (from: Position, to: Position) => {
    const path = Skia.Path.Make();

    const startX = from.x;
    const startY = from.y;
    const endX = to.x;
    const endY = to.y;

    // Create curved Bezier path
    path.moveTo(startX, startY);

    const midY = (startY + endY) / 2;
    const controlPoint1X = startX;
    const controlPoint1Y = midY;
    const controlPoint2X = endX;
    const controlPoint2Y = midY;

    path.cubicTo(
      controlPoint1X,
      controlPoint1Y,
      controlPoint2X,
      controlPoint2Y,
      endX,
      endY,
    );

    return path;
  };

  // Node positions (used for rendering and text overlays)
  const inputPos: Position = {
    x: BOARD_WIDTH / 2,
    y: NODE_RADIUS + 20,
  };

  const outputPos: Position = {
    x: BOARD_WIDTH / 2,
    y: BOARD_HEIGHT - NODE_RADIUS - 20,
  };

  const renderBoard = () => {
    const elements: JSX.Element[] = [];

    // Draw connections (pipes)
    currentLevel.connections.forEach(conn => {
      let fromPos: Position = inputPos;
      let toPos: Position = outputPos;

      if (conn.from === 'input') {
        fromPos = inputPos;
      } else {
        const fromSlot = currentLevel.slots.find(s => s.id === conn.from);
        if (fromSlot) {
          fromPos = fromSlot.position;
        }
      }

      if (conn.to === 'output') {
        toPos = outputPos;
      } else {
        const toSlot = currentLevel.slots.find(s => s.id === conn.to);
        if (toSlot) {
          toPos = toSlot.position;
          // Adjust for input ports if needed
          if (
            conn.toPort !== undefined &&
            toSlot.placedComponent?.inputPorts === 2
          ) {
            toPos = {
              x: toPos.x - (conn.toPort === 0 ? 20 : -20),
              y: toPos.y - COMPONENT_HEIGHT / 2,
            };
          }
        }
      }

      const pipePath = renderCurvedPipe(
        {
          x: fromPos.x,
          y:
            fromPos.y +
            (conn.from === 'input' ? NODE_RADIUS : COMPONENT_HEIGHT / 2),
        },
        {
          x: toPos.x,
          y:
            toPos.y -
            (conn.to === 'output' ? NODE_RADIUS : COMPONENT_HEIGHT / 2),
        },
      );

      elements.push(
        <Path
          key={conn.id}
          path={pipePath}
          color="#60A5FA"
          style="stroke"
          strokeWidth={4}
        />,
      );
    });

    // Draw input node
    elements.push(
      <Circle
        key="input-circle"
        cx={inputPos.x}
        cy={inputPos.y}
        r={NODE_RADIUS}
        color="#14B8A6"
      />,
    );

    // Draw output node
    elements.push(
      <Circle
        key="output-circle"
        cx={outputPos.x}
        cy={outputPos.y}
        r={NODE_RADIUS}
        color="#8B5CF6"
      />,
    );

    // Draw component slots
    currentLevel.slots.forEach(slot => {
      const slotPath = Skia.Path.Make();
      slotPath.addRRect({
        rect: {
          x: slot.position.x - COMPONENT_WIDTH / 2,
          y: slot.position.y - COMPONENT_HEIGHT / 2,
          width: COMPONENT_WIDTH,
          height: COMPONENT_HEIGHT,
        },
        rx: 12,
        ry: 12,
      });

      // Draw slot background
      elements.push(
        <Path
          key={`${slot.id}-bg`}
          path={slotPath}
          color={slot.highlight ? '#FCD34D' : '#E5E7EB'}
          style="fill"
        />,
      );

      // Draw slot border
      elements.push(
        <Path
          key={`${slot.id}-border`}
          path={slotPath}
          color={slot.highlight ? '#F59E0B' : '#9CA3AF'}
          style="stroke"
          strokeWidth={2}
        />,
      );

      // Draw placed component if any
      if (slot.placedComponent) {
        const comp = slot.placedComponent;

        // Component background
        const compPath = Skia.Path.Make();
        compPath.addRRect({
          rect: {
            x: slot.position.x - COMPONENT_WIDTH / 2 + 4,
            y: slot.position.y - COMPONENT_HEIGHT / 2 + 4,
            width: COMPONENT_WIDTH - 8,
            height: COMPONENT_HEIGHT - 8,
          },
          rx: 8,
          ry: 8,
        });

        elements.push(
          <Path
            key={`${slot.id}-comp-bg`}
            path={compPath}
            color="#60A5FA"
            style="fill"
          />,
        );

        // Draw input ports for multi-input components
        if (comp.inputPorts === 2) {
          elements.push(
            <Circle
              key={`${slot.id}-port-0`}
              cx={slot.position.x - 20}
              cy={slot.position.y - COMPONENT_HEIGHT / 2}
              r={6}
              color="#1E293B"
            />,
          );
          elements.push(
            <Circle
              key={`${slot.id}-port-1`}
              cx={slot.position.x + 20}
              cy={slot.position.y - COMPONENT_HEIGHT / 2}
              r={6}
              color="#1E293B"
            />,
          );
        }
      }
    });

    return elements;
  };

  return (
    <View style={styles.container} testID="pipeflow-screen">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>PIPEFLOW</Text>
        <Text style={styles.levelText}>Level {currentLevel.id}</Text>
      </View>

      {/* Board */}
      <View style={styles.boardContainer}>
        <View
          style={{
            width: BOARD_WIDTH,
            height: BOARD_HEIGHT,
            position: 'relative',
          }}>
          {/* Board background with gradient effect */}
          <View
            style={{
              width: BOARD_WIDTH,
              height: BOARD_HEIGHT,
              position: 'absolute',
              backgroundColor: '#1E293B',
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          />

          {/* Connection lines using SVG */}
          <Svg
            width={BOARD_WIDTH}
            height={BOARD_HEIGHT}
            style={{position: 'absolute'}}>
            {currentLevel.connections.map(conn => {
              let fromPos: Position = inputPos;
              let toPos: Position = outputPos;

              if (conn.from === 'input') {
                fromPos = inputPos;
              } else {
                const fromSlot = currentLevel.slots.find(
                  s => s.id === conn.from,
                );
                if (fromSlot) fromPos = fromSlot.position;
              }

              if (conn.to === 'output') {
                toPos = outputPos;
              } else {
                const toSlot = currentLevel.slots.find(s => s.id === conn.to);
                if (toSlot) {
                  toPos = toSlot.position;
                  if (
                    conn.toPort !== undefined &&
                    toSlot.placedComponent?.inputPorts === 2
                  ) {
                    toPos = {
                      x: toPos.x - (conn.toPort === 0 ? 20 : -20),
                      y: toPos.y - COMPONENT_HEIGHT / 2,
                    };
                  }
                }
              }

              const startY =
                fromPos.y +
                (conn.from === 'input' ? NODE_RADIUS : COMPONENT_HEIGHT / 2);
              const endY =
                toPos.y -
                (conn.to === 'output' ? NODE_RADIUS : COMPONENT_HEIGHT / 2);
              const midY = (startY + endY) / 2;

              // Create curved path
              const pathData = `M ${fromPos.x} ${startY} C ${fromPos.x} ${midY}, ${toPos.x} ${midY}, ${toPos.x} ${endY}`;

              return (
                <Path
                  key={conn.id}
                  d={pathData}
                  stroke="#60A5FA"
                  strokeWidth={3}
                  fill="none"
                  opacity={0.7}
                />
              );
            })}
          </Svg>

          {/* Input node with glow effect */}
          <View
            style={{
              position: 'absolute',
              left: inputPos.x - NODE_RADIUS,
              top: inputPos.y - NODE_RADIUS,
              width: NODE_RADIUS * 2,
              height: NODE_RADIUS * 2,
              borderRadius: NODE_RADIUS,
              backgroundColor: '#14B8A6',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#14B8A6',
              shadowOffset: {width: 0, height: 0},
              shadowOpacity: 0.6,
              shadowRadius: 12,
              elevation: 8,
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#FFFFFF',
              }}>
              {currentLevel.inputValue}
            </Text>
          </View>

          {/* Output node with glow effect */}
          <View
            style={{
              position: 'absolute',
              left: outputPos.x - NODE_RADIUS,
              top: outputPos.y - NODE_RADIUS,
              width: NODE_RADIUS * 2,
              height: NODE_RADIUS * 2,
              borderRadius: NODE_RADIUS,
              backgroundColor: '#8B5CF6',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#8B5CF6',
              shadowOffset: {width: 0, height: 0},
              shadowOpacity: 0.6,
              shadowRadius: 12,
              elevation: 8,
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#FFFFFF',
              }}>
              {currentLevel.goalValue}
            </Text>
          </View>

          {/* Component slots */}
          {currentLevel.slots.map(slot => {
            const comp = slot.placedComponent;
            const isSelected = selectedSlot === slot.id;
            console.log('Rendering slot:', slot.id, 'placedComponent:', comp);

            return (
              <View
                key={slot.id}
                style={{
                  position: 'absolute',
                  left: slot.position.x - COMPONENT_WIDTH / 2,
                  top: slot.position.y - COMPONENT_HEIGHT / 2,
                  width: COMPONENT_WIDTH,
                  height: COMPONENT_HEIGHT,
                  borderRadius: 16,
                  backgroundColor: comp ? '#3B82F6' : '#475569',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: isSelected ? 4 : comp ? 3 : 2,
                  borderColor: isSelected
                    ? '#FCD34D'
                    : comp
                    ? '#60A5FA'
                    : '#64748B',
                  shadowColor: comp ? '#3B82F6' : '#000',
                  shadowOffset: {width: 0, height: comp ? 0 : 2},
                  shadowOpacity: comp ? 0.5 : 0.2,
                  shadowRadius: comp ? 8 : 4,
                  elevation: comp ? 6 : 2,
                }}>
                {comp && (
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: 'bold',
                      color: '#FFFFFF',
                    }}>
                    {comp.symbol}
                  </Text>
                )}
                {!comp && (
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: '#94A3B8',
                    }}>
                    ?
                  </Text>
                )}
              </View>
            );
          })}

          {/* Touchable slot overlays */}
          {currentLevel.slots.map(slot => (
            <TouchableOpacity
              key={`slot-touch-${slot.id}`}
              style={{
                position: 'absolute',
                left: slot.position.x - COMPONENT_WIDTH / 2,
                top: slot.position.y - COMPONENT_HEIGHT / 2,
                width: COMPONENT_WIDTH,
                height: COMPONENT_HEIGHT,
              }}
              onPress={() => handleSlotTap(slot.id)}
            />
          ))}
        </View>
      </View>

      {/* Level navigation (for testing) */}
      <View style={styles.levelNav}>
        <TouchableOpacity
          testID="prev-level-button"
          style={[
            styles.navButton,
            currentLevelIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={prevLevel}
          disabled={currentLevelIndex === 0}>
          <Text style={styles.navButtonText}>← Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="next-level-button"
          style={[
            styles.navButton,
            currentLevelIndex === levels.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={nextLevel}
          disabled={currentLevelIndex === levels.length - 1}>
          <Text style={styles.navButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>

      {/* Component Tray */}
      <View style={styles.tray} testID="component-tray">
        {getAvailableComponents().map((component, index) => (
          <TouchableOpacity
            key={`${component.id}-${index}`}
            style={[
              styles.componentCard,
              selectedComponent?.id === component.id &&
                styles.componentCardSelected,
            ]}
            onPress={() => handleComponentTap(component)}>
            <Text style={styles.componentText}>{component.symbol}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderBottomWidth: 2,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#60A5FA',
    letterSpacing: 2,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#94A3B8',
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  levelNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  navButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  navButtonDisabled: {
    backgroundColor: '#475569',
    shadowOpacity: 0,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tray: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E293B',
    borderTopWidth: 2,
    borderTopColor: '#334155',
    gap: 16,
  },
  componentCard: {
    width: COMPONENT_WIDTH,
    height: COMPONENT_HEIGHT,
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#60A5FA',
    shadowColor: '#3B82F6',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  componentCardSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#FCD34D',
    borderWidth: 4,
    shadowColor: '#FCD34D',
    shadowOpacity: 0.6,
    transform: [{scale: 1.05}],
  },
  componentText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default PipeflowScreen;
