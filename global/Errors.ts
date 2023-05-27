export default {
  auth: {
    emailIsNotUniqueError: {
      error: 'auth-0001',
      message: 'the email must be unique.',
    },
    userNotFoundError: {
      error: 'auth-0002',
      message: 'the email or password is incorrect.',
    },
  },
  server: {
    unknownError: {
      error: 'server-0001',
      message: 'an unknown error has occurred, please try again later.',
    },
    validationError: {
      error: 'server-0002',
      message: 'the request body has invalid fields',
    },
  },
}
