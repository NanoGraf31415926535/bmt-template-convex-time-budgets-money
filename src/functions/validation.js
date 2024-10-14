export const controlMaximum0 = function (input, parameter) {
  const answer = parameter.basePayoff.value + parameter.budget.value
  return input.toString() === answer.toString()
}

export const controlMaximum2 = function (input, parameter) {
  const exampleExchangeRate2 = 1.25;
  const answer = parameter.basePayoff.value + parameter.budget.value * exampleExchangeRate2;
  return input.toString() === answer.toString()
}

export const controlSplit = function (input, parameter){
  const exampleExchangeRate3 = 1.5;
  const controlSplitTargetPosition = 6;
  const answer = parameter.basePayoff.value + controlSplitTargetPosition * exampleExchangeRate3 * parameter.budget.value / parameter.numSteps.value
  // todo: is there any danger of rounding issues with decimals? should one extract the money amount here?
  return input.toString() === answer.toString()
}