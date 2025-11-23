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
    echo "Usage: $0 [matrix|graph|website|all]"
    echo ""
    echo "Options:"
    echo "  matrix        - Run GeneExpressionMatrix page tests"
    echo "  graph         - Run GeneExpressionGraph component tests"
    echo "  website       - Run general website tests"
    echo "  all           - Run all component tests"
    echo ""
    exit 1
fi

case $1 in
    "matrix")
        run_test "tests/gene-expression-matrix.test.ts" "GeneExpressionMatrix"
        ;;
    "graph")
        run_test "tests/gene-expression-graph.test.ts" "GeneExpressionGraph"
        ;;
    "website")
        run_test "tests/website.test.ts" "Website"
        ;;
    "all")
        echo "Running all component tests..."
        echo ""
        run_test "tests/gene-expression-matrix.test.ts" "GeneExpressionMatrix"
        run_test "tests/gene-expression-graph.test.ts" "GeneExpressionGraph"
        run_test "tests/website.test.ts" "Website"
        echo "All component tests completed!"
        ;;
    *)
        echo "Invalid option: $1"
        echo "Use 'matrix', 'graph', 'website', or 'all'"
        exit 1
        ;;
esac
