#!/bin/bash

# Bgee Component Tests Runner
# This script runs end-to-end tests for the GeneExpressionMatrix and GeneExpressionGraph components

echo "Bgee Component Tests Runner"
echo "==============================="

# Check if the dev server is running
if ! curl -s http://localhost:5173 > /dev/null; then
    echo "Development server is not running on http://localhost:5173"
    echo "Please start the dev server first with: npm run dev"
    exit 1
fi

echo "Development server is running"
echo ""

# Function to run specific test file
run_test() {
    local test_file=$1
    local test_name=$2
    
    echo "Running $test_name tests..."
    echo "----------------------------------------"
    
    if npx playwright test "$test_file" --headed; then
        echo "$test_name tests passed!"
    else
        echo "$test_name tests failed!"
        return 1
    fi
    echo ""
}

# Check command line arguments
if [ $# -eq 0 ]; then
    echo "Usage: $0 [matrix|matrix-simple|matrix-basic|matrix-minimal|graph|simple|basic|minimal|all]"
    echo ""
    echo "Options:"
    echo "  matrix        - Run comprehensive GeneExpressionMatrix page tests"
    echo "  matrix-simple - Run simple GeneExpressionMatrix page tests"
    echo "  matrix-basic  - Run basic GeneExpressionMatrix page tests"
    echo "  matrix-minimal- Run minimal GeneExpressionMatrix page tests (start here!)"
    echo "  graph         - Run GeneExpressionGraph component tests"
    echo "  simple        - Run simple versions of all tests"
    echo "  basic         - Run basic versions of all tests"
    echo "  minimal       - Run minimal versions of all tests"
    echo "  all           - Run all comprehensive component tests"
    echo ""
    exit 1
fi

case $1 in
    "matrix")
        run_test "tests/gene-expression-matrix.test.ts" "GeneExpressionMatrix"
        ;;
    "matrix-simple")
        run_test "tests/gene-expression-matrix-simple.test.ts" "GeneExpressionMatrix (Simple)"
        ;;
    "matrix-basic")
        run_test "tests/gene-expression-matrix-basic.test.ts" "GeneExpressionMatrix (Basic)"
        ;;
    "matrix-minimal")
        run_test "tests/gene-expression-matrix-minimal.test.ts" "GeneExpressionMatrix (Minimal)"
        ;;
    "graph")
        run_test "tests/gene-expression-graph.test.ts" "GeneExpressionGraph"
        ;;
    "all")
        echo "Running all component tests..."
        echo ""
        run_test "tests/gene-expression-matrix.test.ts" "GeneExpressionMatrix"
        run_test "tests/gene-expression-graph.test.ts" "GeneExpressionGraph"
        echo "All component tests completed!"
        ;;
    "simple")
        echo "Running simple component tests..."
        echo ""
        run_test "tests/gene-expression-matrix-simple.test.ts" "GeneExpressionMatrix (Simple)"
        run_test "tests/gene-expression-graph.test.ts" "GeneExpressionGraph"
        echo "🎉 Simple component tests completed!"
        ;;
    "basic")
        echo "Running basic component tests..."
        echo ""
        run_test "tests/gene-expression-matrix-basic.test.ts" "GeneExpressionMatrix (Basic)"
        run_test "tests/gene-expression-graph.test.ts" "GeneExpressionGraph"
        echo "Basic component tests completed!"
        ;;
    "minimal")
        echo "Running minimal component tests..."
        echo ""
        run_test "tests/gene-expression-matrix-minimal.test.ts" "GeneExpressionMatrix (Minimal)"
        run_test "tests/gene-expression-graph.test.ts" "GeneExpressionGraph"
        echo "Minimal component tests completed!"
        ;;
    *)
        echo "Invalid option: $1"
        echo "Use 'matrix', 'matrix-simple', 'matrix-basic', 'matrix-minimal', 'graph', 'simple', 'basic', 'minimal', or 'all'"
        exit 1
        ;;
esac
