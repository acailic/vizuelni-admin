# chart-config-ui-options.ts Refactoring Plan

## Current State

- **Size**: 47,928 lines (massive, unmaintainable)
- **Purpose**: Controls chart controls displayed in UI for different chart types
- **Exports**: 15 main exports (types, constants, functions)

## File Structure Analysis

Based on analysis, the file contains:

### 1. Type Definitions (lines 1-400 approx)

- `EncodingFieldType` - Union type for all encoding field types
- `EncodingOptionChartSubType<T>` - Chart subtype options
- `EncodingOption<T>` - Generic encoding option type
- `EncodingSortingOption<T>` - Sorting option type
- `EncodingSpec<T, F>` - Encoding specification interface
- Various utility types for encoding options

### 2. Constants (lines 400-600 approx)

- `AREA_SEGMENT_SORTING` - Default sorting for area charts
- `COLUMN_SEGMENT_SORTING` - Default sorting for column charts
- `PIE_SEGMENT_SORTING` - Pie chart sorting options
- `ANIMATION_FIELD_SPEC` - Animation field configuration
- Other chart-specific constants

### 3. Helper Functions (lines 600-1500 approx)

- `disableStacked()` - Check if stacking is disabled
- `defaultSegmentOnChange()` - Default segment change handler
- `getChartSpec<T>()` - Main function to get chart specifications
- Various field-level helpers and utilities

### 4. Side Effect Functions (lines 1500+ approx)

- `getChartFieldChangeSideEffect()` - Get onChange for field changes
- `getChartFieldDeleteSideEffect()` - Get onDelete for field deletions
- `getChartFieldOptionChangeSideEffect()` - Get onChange for option changes

## Proposed File Split

### File 1: `chart-config-ui-types.ts`

**Purpose**: All type definitions **Exports**:

- All encoding field types
- `EncodingOption` and related types
- `EncodingSpec` interface
- All utility types

**Size**: ~400 lines

### File 2: `chart-config-ui-constants.ts`

**Purpose**: Chart-specific constants and default values **Exports**:

- `AREA_SEGMENT_SORTING`
- `COLUMN_SEGMENT_SORTING`
- `PIE_SEGMENT_SORTING`
- `ANIMATION_FIELD_SPEC`
- Other default configurations

**Size**: ~200 lines

### File 3: `chart-config-ui-helpers.ts`

**Purpose**: Helper functions for chart configuration **Exports**:

- `disableStacked()`
- `defaultSegmentOnChange()`
- Field manipulation helpers
- Utility functions

**Size**: ~300 lines

### File 4: `chart-config-spec.ts`

**Purpose**: Main chart specification generator **Exports**:

- `getChartSpec<T>()` - Main spec generator
- Spec-related helpers

**Size**: ~500 lines

### File 5: `chart-config-side-effects.ts`

**Purpose**: Side effect handlers for field changes **Exports**:

- `getChartFieldChangeSideEffect()`
- `getChartFieldDeleteSideEffect()`
- `getChartFieldOptionChangeSideEffect()`

**Size**: ~400 lines

### File 6: `chart-config-ui-options.ts` (Updated)

**Purpose**: Main re-export file and integration **Exports**:

- Re-export everything from split files
- Maintain backward compatibility
- Main entry point

**Size**: ~50 lines

## Benefits of This Split

1. **Maintainability**: Each file has a clear, focused purpose
2. **Testability**: Smaller units are easier to test
3. **Performance**: Tree-shaking can better eliminate unused code
4. **Onboarding**: New developers can understand structure faster
5. **Reduced Merge Conflicts**: Smaller files = fewer conflicts
6. **Better Code Review**: Reviewers can focus on specific areas

## Implementation Notes

1. **Maintain backward compatibility**: Keep all exports in main file
2. **Use re-exports**: `export * from "./chart-config-ui-types"`
3. **Add JSDoc**: Document all exports in new files
4. **Update imports**: Update files that import from chart-config-ui-options.ts
5. **Run tests**: Ensure nothing breaks after split

## Migration Guide

### Before:

```ts
import {
  EncodingOption,
  getChartSpec,
  AREA_SEGMENT_SORTING,
} from "@/charts/chart-config-ui-options";
```

### After (backward compatible - still works):

```ts
import {
  EncodingOption,
  getChartSpec,
  AREA_SEGMENT_SORTING,
} from "@/charts/chart-config-ui-options";
```

### After (direct imports - optional):

```ts
import { EncodingOption } from "@/charts/chart-config-ui-types";
import { getChartSpec } from "@/charts/chart-config-spec";
import { AREA_SEGMENT_SORTING } from "@/charts/chart-config-ui-constants";
```

## Estimated Effort

- Analysis and planning: 1 hour (done)
- File splitting: 2-3 hours
- Testing and validation: 1 hour
- **Total**: 4-5 hours

## Next Steps

1. [ ] Create `chart-config-ui-types.ts`
2. [ ] Create `chart-config-ui-constants.ts`
3. [ ] Create `chart-config-ui-helpers.ts`
4. [ ] Create `chart-config-spec.ts`
5. [ ] Create `chart-config-side-effects.ts`
6. [ ] Update main `chart-config-ui-options.ts` to re-export
7. [ ] Update all imports throughout codebase
8. [ ] Run tests to verify
9. [ ] Build to verify compilation

## Risk Mitigation

- Create git branch before starting
- Run full test suite after each file split
- Keep backward compatibility via re-exports
- Document any breaking changes (should be none)
