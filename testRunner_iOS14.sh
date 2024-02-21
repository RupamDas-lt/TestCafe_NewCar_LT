for i in $(seq 1 20); do
  echo "Iteration $i"
  export PLATFORM_VERSION=iOS14
  testcafe "lambdatest:iPhone 12@14.2:ios" tests/consumer -q --skip-js-errors
done