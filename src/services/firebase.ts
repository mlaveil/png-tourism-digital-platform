/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyBeIYzudCxYKcXJUiweDRX9wikkdm971aE',
  authDomain: 'png-tourism-digital-platform.firebaseapp.com',
  projectId: 'png-tourism-digital-platform',
  storageBucket: 'png-tourism-digital-platform.firebasestorage.app',
  messagingSenderId: '4530968411',
  appId: '1:4530968411:web:174fe976ae640639612c7e'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
