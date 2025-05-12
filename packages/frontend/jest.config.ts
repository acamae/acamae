import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    automock: true,
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'd.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/packages/frontend/src/$1', // Para que funcionen los imports con @/
    },
    setupFilesAfterEnv: ['<rootDir>/packages/frontend/setupTests.ts'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['<rootDir>/packages/frontend/src/**/*.test.(ts|tsx)'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
};

export default config;
