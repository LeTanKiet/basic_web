function validateName(element) {
  const value = element.value;

  const errorElement = document.querySelector('.name-error');
  if (!value) {
    errorElement.innerHTML = 'This field is required';
    return 'This field is required';
  } else {
    errorElement.innerHTML = '';
    return '';
  }
}

function validateEmail(element) {
  const value = element.value;

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const errorElement = document.querySelector('.email-error');
  if (!value) {
    errorElement.innerHTML = 'This field is required';
    return 'This field is required';
  } else if (!emailPattern.test(value)) {
    errorElement.innerHTML = 'Invalid email';
    return 'Invalid email';
  } else {
    errorElement.innerHTML = '';
    return '';
  }
}

function validatePassword(element) {
  const value = element.value;

  const errorElement = document.querySelector('.password-error');
  if (!value) {
    errorElement.innerHTML = 'This field is required';
    return 'This field is required';
  } else if (value.length < 3) {
    errorElement.innerHTML = 'This field must have at least 3 characters';
    return 'This field must have at least 3 characters';
  } else {
    errorElement.innerHTML = '';
    return '';
  }
}

function validateConfirmPassword(element) {
  const value = element.value;

  const errorElement = document.querySelector('.confirm-password-error');
  const password = document.querySelector('input[name="password"]').value;
  if (!value) {
    errorElement.innerHTML = 'This field is required';
    return 'This field is required';
  } else if (value !== password) {
    errorElement.innerHTML = 'Confirm password is not match with password';
    return 'Confirm password is not match with password';
  } else {
    errorElement.innerHTML = '';
    return '';
  }
}

async function handleLogin(event) {
  const emailElement = document.querySelector("input[name='email']");
  const passwordElement = document.querySelector("input[name='password']");

  if (validateEmail(emailElement) || validatePassword(passwordElement)) {
    event.preventDefault();
    return;
  }

  await fetch('https://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: emailElement.value,
      password: passwordElement.value,
    }),
  });
}

async function handleSignup(event) {
  const nameElement = document.querySelector("input[name='name']");
  const emailElement = document.querySelector("input[name='email']");
  const passwordElement = document.querySelector("input[name='password']");
  const confirmPasswordElement = document.querySelector("input[name='confirmPassword']");
  const roleElement = document.querySelector("input[name='role']");

  if (
    validateName(nameElement) ||
    validateEmail(emailElement) ||
    validatePassword(passwordElement) ||
    validateConfirmPassword(confirmPasswordElement)
  ) {
    event.preventDefault();
    return;
  }

  await fetch('https://localhost:3000/auth/sign-up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: nameElement.value,
      email: emailElement.value,
      password: passwordElement.value,
      confirmPassword: confirmPasswordElement.value,
      role: roleElement.value,
    }),
  });
}
