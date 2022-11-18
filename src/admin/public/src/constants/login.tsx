export const PAGE_CONFIG = {
  login: {
    title: 'Log in to Serverless CD',
    description: 'Enter your email address and password.',
    btnText: 'Log in',
    type: 'login',
    linkTo: '/signUp',
    linkText: 'Don’t have an account yet? Sign up',
  },
  signUp: {
    title: 'Create a Serverless CD account',
    description: 'Sign up with your email and a password.',
    btnText: 'Sign Up',
    type: 'signUp',
    linkTo: '/login?type=account',
    linkText: 'Already have an account? Log in'
  }
}