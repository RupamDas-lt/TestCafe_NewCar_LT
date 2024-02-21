for i in $(seq 1 20); do
  echo "Iteration $i"
  export PLATFORM_VERSION=iOS15
  testcafe "lambdatest:iPhone 13@15.0:ios" tests/consumer -q --skip-js-errors
done