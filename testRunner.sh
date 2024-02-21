for i in $(seq 1 100); do
  echo "Iteration $i"
  testcafe "lambdatest:iPhone 13@15.0:ios" tests/consumer -q --skip-js-errors
done