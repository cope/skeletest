# Skeletest Simplification Plan
**Date:** July 16, 2025

## Overview
This document outlines a step-by-step plan to improve and simplify the skeletest project. The goal is to make the code clean, lean, and maintainable while ensuring the project works after each step.

## Current State Analysis
- **Purpose**: Compare file structures of src and test folders, report differences, and optionally fix issues
- **Main Issues**: Poor test coverage, complex logic, scattered concerns, verbose code
- **Core Functionality**: 
  - Compare src vs test folder structures
  - Report missing/wrong test files
  - With `-f` flag: create missing test files and move misplaced files

## Step-by-Step Improvement Plan

### Phase 1: Foundation & Safety
**Goal**: Establish solid foundation with comprehensive test coverage

#### Step 1: Complete Test Coverage for Core Functions
- **Priority**: HIGH
- **Effort**: 2-3 hours
- **Description**: Write comprehensive unit tests for all functions in `src/functions/`
- **Files to test**:
  - `bail.ts` - error handling
  - `check.folder.ts` - folder validation
  - `convert.files.to.objects.ts` - file object conversion
  - `fix.extension.ts` - extension formatting
  - `get.config.ts` - configuration loading
  - `get.files.listing.ts` - file system traversal
  - `get.skeletest.file.content.ts` - test file template generation
  - `get.table.from.file.objects.ts` - table formatting
  - `get.table.of.files.ts` - file table generation
  - `get.timestamp.ts` - timestamp utilities
  - `is.ignored.ts` - ignore pattern matching
- **Success Criteria**: 100% test coverage for all utility functions
- **Risk**: Low - only adding tests

#### Step 2: Add Integration Tests for Main Logic
- **Priority**: HIGH
- **Effort**: 3-4 hours
- **Description**: Create integration tests for the main skeletor workflow
- **Test Scenarios**:
  - Basic file comparison (matching structure)
  - Missing test files detection
  - Wrong test files detection
  - Fix mode: creating missing files
  - Fix mode: moving misplaced files
  - Configuration variations
  - Edge cases (empty folders, special characters)
- **Success Criteria**: Main workflows covered by integration tests
- **Risk**: Low - only adding tests

#### Step 3: Add CLI Tests
- **Priority**: MEDIUM
- **Effort**: 1-2 hours
- **Description**: Test the CLI interface and command-line argument parsing
- **Test Scenarios**:
  - Version flag
  - Help flag
  - Config file parameter
  - Fix flag
  - Verbose flag
  - Invalid arguments
- **Success Criteria**: CLI behavior is tested and documented
- **Risk**: Low - only adding tests

### Phase 2: Code Structure Improvements
**Goal**: Simplify and clean up the codebase

#### Step 4: Extract Configuration Validation
- **Priority**: HIGH
- **Effort**: 1-2 hours
- **Description**: Create a dedicated config validation module
- **Changes**:
  - Create `validate.config.ts` function
  - Extract validation logic from `get.config.ts`
  - Add proper error messages for invalid config
  - Validate array types, required fields, etc.
- **Success Criteria**: Config validation is isolated and testable
- **Risk**: Low - pure refactoring with test coverage

#### Step 5: Simplify File Listing Logic
- **Priority**: MEDIUM
- **Effort**: 2-3 hours
- **Description**: Refactor file listing to be more readable and efficient
- **Changes**:
  - Simplify `get.files.listing.ts` recursive logic
  - Better separation of concerns (extensions vs additional extensions)
  - Add file filtering as separate function
  - Remove lodash dependencies where simple JS works
- **Success Criteria**: File listing is easier to understand and maintain
- **Risk**: Medium - requires careful testing

#### Step 6: Break Down Skeletor Main Function
- **Priority**: HIGH
- **Effort**: 3-4 hours
- **Description**: The main `skeletor.ts` function is 200+ lines and does too much
- **Changes**:
  - Extract `compareFileStructures()` function
  - Extract `generateExpectedTestFiles()` function
  - Extract `handleFixMode()` function
  - Extract `reportResults()` function
  - Keep main function as orchestrator only
- **Success Criteria**: Main function is under 50 lines, each function has single responsibility
- **Risk**: Medium - requires careful refactoring

#### Step 7: Improve Error Handling
- **Priority**: MEDIUM
- **Effort**: 1-2 hours
- **Description**: Standardize error handling throughout the application
- **Changes**:
  - Create custom error types for different scenarios
  - Replace `bail()` with proper error throwing
  - Add try-catch blocks in appropriate places
  - Improve error messages with actionable information
- **Success Criteria**: Consistent error handling and better user experience
- **Risk**: Low - mostly additive changes

### Phase 3: Feature Simplification
**Goal**: Remove unnecessary complexity and focus on core functionality

#### Step 8: Simplify Vue Files Support
- **Priority**: LOW
- **Effort**: 1-2 hours
- **Description**: The Vue files support adds complexity - simplify or remove
- **Changes**:
  - Evaluate if Vue support is actually needed
  - If needed, integrate it cleanly with the main extension logic
  - Remove hardcoded constants and make configurable
  - Simplify the additional file processing logic
- **Success Criteria**: Vue support is either removed or cleanly integrated
- **Risk**: Low - feature is optional

#### Step 9: Streamline Configuration Options
- **Priority**: MEDIUM
- **Effort**: 2-3 hours
- **Description**: Review and simplify configuration options
- **Changes**:
  - Remove rarely used options (evaluate usage)
  - Simplify option names and structure
  - Better defaults that work for most cases
  - Consolidate related options
- **Success Criteria**: Configuration is simpler and more intuitive
- **Risk**: Medium - might break existing user configs

#### Step 10: Optimize File Operations
- **Priority**: LOW
- **Effort**: 1-2 hours
- **Description**: Improve file system operations efficiency
- **Changes**:
  - Reduce duplicate file system calls
  - Use async operations where appropriate
  - Cache file listings when possible
  - Optimize ignore pattern matching
- **Success Criteria**: Better performance, especially on large codebases
- **Risk**: Low - mostly optimization

### Phase 4: Code Quality & Maintainability
**Goal**: Improve code quality and developer experience

#### Step 11: Remove Lodash Dependencies
- **Priority**: LOW
- **Effort**: 2-3 hours
- **Description**: Replace lodash with native JavaScript where possible
- **Changes**:
  - Replace simple lodash functions with native equivalents
  - Keep only complex lodash functions that add real value
  - Reduce bundle size and dependencies
- **Success Criteria**: Fewer dependencies, same functionality
- **Risk**: Low - each replacement can be tested individually

#### Step 12: Improve TypeScript Types
- **Priority**: MEDIUM
- **Effort**: 1-2 hours
- **Description**: Add proper TypeScript types throughout the codebase
- **Changes**:
  - Replace `any` types with proper interfaces
  - Add return type annotations
  - Create interfaces for configuration objects
  - Add generic types where appropriate
- **Success Criteria**: Better type safety and IDE support
- **Risk**: Low - mostly additive changes

#### Step 13: Add JSDoc Documentation
- **Priority**: LOW
- **Effort**: 1-2 hours
- **Description**: Add comprehensive JSDoc comments
- **Changes**:
  - Document all public functions
  - Add parameter descriptions
  - Add usage examples
  - Document configuration options
- **Success Criteria**: Better developer experience and maintainability
- **Risk**: Low - only adding documentation

#### Step 14: Standardize Code Style
- **Priority**: LOW
- **Effort**: 1 hour
- **Description**: Ensure consistent code style throughout
- **Changes**:
  - Run prettier/eslint on all files
  - Fix any style inconsistencies
  - Update linting rules if needed
- **Success Criteria**: Consistent code style
- **Risk**: Low - automated formatting

### Phase 5: Final Cleanup
**Goal**: Final polish and optimization

#### Step 15: Performance Optimization
- **Priority**: LOW
- **Effort**: 1-2 hours
- **Description**: Final performance improvements
- **Changes**:
  - Profile the application for bottlenecks
  - Optimize hot paths
  - Reduce memory usage
  - Improve startup time
- **Success Criteria**: Noticeably better performance
- **Risk**: Low - optimization only

#### Step 16: Update Documentation
- **Priority**: MEDIUM
- **Effort**: 1-2 hours
- **Description**: Update README and documentation
- **Changes**:
  - Update README with new configuration format
  - Add examples for common use cases
  - Document migration path from old version
  - Add troubleshooting section
- **Success Criteria**: Users can easily understand and use the tool
- **Risk**: Low - documentation only

#### Step 17: Final Testing & Validation
- **Priority**: HIGH
- **Effort**: 2-3 hours
- **Description**: Comprehensive testing of the improved version
- **Changes**:
  - Test all features end-to-end
  - Test with various project structures
  - Validate performance improvements
  - Test edge cases and error conditions
- **Success Criteria**: All functionality works correctly
- **Risk**: Low - testing only

## Implementation Guidelines

### Safety Principles
1. **Always run tests** before and after each step
2. **Make small commits** for each step
3. **Test manually** after each step to ensure functionality
4. **Keep a working version** at all times
5. **Document any breaking changes** immediately

### Testing Strategy
- Run `pnpm test` after each step
- Run `pnpm go` (manual test) after each step
- Test with different project structures
- Test both normal and fix modes
- Test edge cases and error conditions

### Risk Mitigation
- **High Priority Steps**: Start with these for maximum impact
- **Medium Risk Steps**: Extra testing and validation
- **Breaking Changes**: Clear migration documentation
- **Rollback Plan**: Keep git history clean for easy rollback

## Success Metrics
- **Code Quality**: Reduced complexity, better maintainability
- **Test Coverage**: >90% coverage for all modules
- **Performance**: Faster execution, lower memory usage
- **User Experience**: Simpler configuration, better error messages
- **Maintainability**: Easier to understand and modify

## Timeline Estimate
- **Phase 1**: 6-9 hours (Foundation & Safety)
- **Phase 2**: 7-11 hours (Code Structure)
- **Phase 3**: 4-7 hours (Feature Simplification)
- **Phase 4**: 4-6 hours (Code Quality)
- **Phase 5**: 4-7 hours (Final Cleanup)

**Total Estimated Time**: 25-40 hours

## Notes
- Each step should be completable in 1-4 hours
- Project must be functional after each step
- Focus on small, incremental improvements
- Maintain backward compatibility where possible
- Document breaking changes clearly 