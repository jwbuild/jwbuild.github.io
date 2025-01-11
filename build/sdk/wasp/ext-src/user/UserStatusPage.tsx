import type { UserStatus } from 'wasp/entities';

import { getUserStatus, updateUserStatus, useQuery } from 'wasp/client/operations';
import { Link as WaspRouterLink, routes } from 'wasp/client/router';
import { useState, useEffect, FormEvent } from 'react';


export default function UserStatusPage() {
  const [location, setLocation] = useState<string>('unknown');
  const [registrationString, setRegistrationString] = useState<string>('unknown');

  async function getLocation () {
    // Check if Geolocation API is available in the browser
    if (!navigator.geolocation) {
        console.error("Geolocation API is not supported by this browser.");
        return;
    }
  
    // Define a helper to handle success
    const onSuccess = async (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
  
        const locationString: string = 
          `Latitude ${latitude}, Longitude ${longitude}`

        console.log(locationString);
        setLocation(locationString) // react hook

        updateUserStatus({location: JSON.stringify(position.coords)})
    };
  
    // Define a helper to handle errors
    const onError = (error: GeolocationPositionError) => {
        console.error("Error obtaining location:", error.message);
    };
  
    // Request device location with high accuracy
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 0,  // Do not use cached location
    });
  }
  
  const PUBLIC_VAPID_KEY = import.meta.env.REACT_APP_WEB_PUSH_KEY

  async function registerServiceWorker() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.register('/build/service-worker.js');
      console.log('Service Worker Registered:', registration);
      return registration;
    } else {
      throw new Error('Push messaging is not supported in this browser.');
    }
  }
  
  async function subscribeToPushNotifications() {
    try {
      const registration = await registerServiceWorker();
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });
      console.log('Subscribed to push notifications.');
      console.log(JSON.stringify(subscription));

      setRegistrationString(JSON.stringify(subscription));
      updateUserStatus({pushSubscription: JSON.stringify(subscription)})
      // Send subscription to the backend
      /*
      await fetch('/subscribe-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });
      */
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  }
  
  // Utility function to convert VAPID key
  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
  }
  
  return (
    <div className='mt-10 px-6'>
      <div className='overflow-hidden border border-gray-900/10 shadow-lg sm:rounded-lg mb-4 lg:m-8 dark:border-gray-100/10'>
        <div className='px-4 py-5 sm:px-6 lg:px-8'>
          <h3 className='text-base font-semibold leading-6 text-gray-900 dark:text-white'>User Status</h3>
        </div>
        <div className='border-t border-gray-900/10 dark:border-gray-100/10 px-4 py-5 sm:p-0'>
          <dl className='sm:divide-y sm:divide-gray-900/10 sm:dark:divide-gray-100/10'>

            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500 dark:text-white'>About</dt>
              <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>{location}</dd>
            </div>
          </dl>
        </div>
        <div className='border-t border-gray-900/10 dark:border-gray-100/10 px-4 py-5 sm:p-0'>
          <dl className='sm:divide-y sm:divide-gray-900/10 sm:dark:divide-gray-100/10'>

            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500 dark:text-white'>About</dt>
              <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>{registrationString}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className='inline-flex w-full justify-end'>
        <button
          onClick={getLocation}
          className='inline-flex justify-center mx-8 py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          Get location
        </button>
      </div>
      <div className='inline-flex w-full justify-end'>
        <button
          // TODO: Trigger subscription on app home page load
          // instead of on button click 
          onClick={subscribeToPushNotifications}
          className='inline-flex justify-center mx-8 py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          Subscribe to push notifications
        </button>
      </div>
    </div>
  );
}




