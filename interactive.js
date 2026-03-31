import inquirer from 'inquirer'

export const inquirerConfirm = async (message) => { 
  const answer = await inquirer.prompt({
    name: 'confirm',
    type: 'confirm',
    message
  });
  return answer
}

export const inquirerChoose = async (message,choices,type = 'list') => { 
  const answer = await inquirer.prompt({
    name: 'choose',
    type,
    message,
    choices
  });
  return answer
}
