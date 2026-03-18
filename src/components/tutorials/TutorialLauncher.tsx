'use client';

import React from 'react';
import { useTutorial, getAllPaths } from '@/lib/tutorials';
import { TutorialPath } from '@/lib/tutorials/types';

/**
 * Tutorial Launcher Component
 * Button to start tutorials, displayed in the UI
 */
export function TutorialLauncher() {
  const { startTutorial, isTutorialCompleted, getAvailableTutorials } =
    useTutorial();
  const availableTutorials = getAvailableTutorials();
  const paths = getAllPaths();

  return (
    <div className='relative group'>
      <button
        className='flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
        aria-label='Start tutorial'
      >
        <span>📚</span>
        <span className='hidden sm:inline'>
          {/* Tutorial label based on locale */}
          Tutoriali
        </span>
      </button>

      {/* Dropdown menu */}
      <div className='absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50'>
        <div className='p-3 border-b border-gray-200 dark:border-gray-700'>
          <h3 className='font-semibold text-gray-900 dark:text-white'>
            Izaberite put učenja
          </h3>
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            {availableTutorials.length} dostupnih tutorijala
          </p>
        </div>

        <div className='p-2'>
          {paths.map((path) => {
            const pathTutorials = availableTutorials.filter(
              (t) => t.path === path.id
            );
            const completedCount = pathTutorials.filter((t) =>
              isTutorialCompleted(t.id)
            ).length;

            return (
              <button
                key={path.id}
                className='w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'
                onClick={() => {
                  if (pathTutorials.length > 0) {
                    startTutorial(pathTutorials[0].id);
                  }
                }}
              >
                <div className='flex items-center gap-3'>
                  <span className='text-2xl'>{path.icon}</span>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-gray-900 dark:text-white text-sm'>
                      {path.name.srLat}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                      {path.description.srLat}
                    </p>
                    <div className='flex items-center gap-2 mt-1'>
                      <span className='text-xs text-blue-600 dark:text-blue-400'>
                        {completedCount}/{pathTutorials.length} završeno
                      </span>
                      <span className='text-xs text-gray-400'>•</span>
                      <span className='text-xs text-gray-400'>
                        ~{path.estimatedTime} min
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Path Selector Component
 * Full page selector for learning paths
 */
export function TutorialPathSelector() {
  const { startTutorial, setCurrentPath, getAvailableTutorials } =
    useTutorial();
  const paths = getAllPaths();

  const handlePathSelect = (pathId: TutorialPath) => {
    setCurrentPath(pathId);
    const tutorials = getAvailableTutorials().filter((t) => t.path === pathId);
    if (tutorials.length > 0) {
      startTutorial(tutorials[0].id);
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
          Izaberite vaš put učenja
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Odaberite profil koji najbolje odgovara vašim potrebama
        </p>
      </div>

      <div className='grid md:grid-cols-2 gap-4'>
        {paths.map((path) => (
          <button
            key={path.id}
            onClick={() => handlePathSelect(path.id)}
            className='p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-lg transition-all text-left'
          >
            <div className='flex items-start gap-4'>
              <span className='text-4xl'>{path.icon}</span>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-1'>
                  {path.name.srLat}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
                  {path.description.srLat}
                </p>
                <div className='flex items-center gap-4 text-xs'>
                  <span className='flex items-center gap-1 text-gray-500'>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    {path.estimatedTime} min
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      path.skillLevel === 'beginner'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : path.skillLevel === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {path.skillLevel === 'beginner'
                      ? 'Početnik'
                      : path.skillLevel === 'intermediate'
                        ? 'Srednji'
                        : 'Napredni'}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Tutorial Badge Component
 * Shows earned badges from tutorials
 */
export function TutorialBadge({
  icon,
  name,
  earned = false,
}: {
  icon: string;
  name: string;
  earned?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        earned
          ? 'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700'
          : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-50'
      }`}
    >
      <span className={`text-lg ${earned ? '' : 'grayscale'}`}>{icon}</span>
      <span
        className={`text-sm font-medium ${
          earned
            ? 'text-yellow-700 dark:text-yellow-300'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        {name}
      </span>
      {earned && (
        <svg
          className='w-4 h-4 text-green-500'
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
            clipRule='evenodd'
          />
        </svg>
      )}
    </div>
  );
}

export default TutorialLauncher;
