import axios from 'axios';
import {getListOfPublicHolidays, getNextPublicHolidays, checkIfTodayIsPublicHoliday} from "./public-holidays.service";
import {PUBLIC_HOLIDAYS_API_URL, SUPPORTED_COUNTRIES} from "../config";
import {checkIfShorterHoliday} from "./public-holidays.service.integration.test";
import {PublicHoliday} from "../types";

const axiosGetSpy = jest.spyOn(axios, 'get');

const PublicHolidaysListMock: PublicHoliday[] = [
    {
        date: '2023-01-01',
        localName: "Jour de l'an",
        name: "New Year's Day",
        countryCode: 'FR',
        fixed: true,
        global: true,
        counties: null,
        launchYear: 1967,
        types: ['Public']
    },
    {
        date: '2023-04-10',
        localName: 'Lundi de Pâques',
        name: 'Easter Monday',
        countryCode: 'FR',
        fixed: false,
        global: true,
        counties: null,
        launchYear: 1642,
        types: ['Public']
    },
    {
        date: '2023-05-01',
        localName: 'Fête du Travail',
        name: 'Labour Day',
        countryCode: 'FR',
        fixed: true,
        global: true,
        counties: null,
        launchYear: null,
        types: ['Public']
    },
    {
        date: '2023-05-08',
        localName: 'Victoire 1945',
        name: 'Victory in Europe Day',
        countryCode: 'FR',
        fixed: true,
        global: true,
        counties: null,
        launchYear: null,
        types: ['Public']
    },
    {
        date: '2023-05-18',
        localName: 'Ascension',
        name: 'Ascension Day',
        countryCode: 'FR',
        fixed: false,
        global: true,
        counties: null,
        launchYear: null,
        types: ['Public']
    },
    {
        date: '2023-05-29',
        localName: 'Lundi de Pentecôte',
        name: 'Whit Monday',
        countryCode: 'FR',
        fixed: false,
        global: true,
        counties: null,
        launchYear: null,
        types: ['Public']
    },
    {
        date: '2023-07-14',
        localName: 'Fête nationale',
        name: 'Bastille Day',
        countryCode: 'FR',
        fixed: true,
        global: true,
        counties: null,
        launchYear: null,
        types: ['Public']
    },
]
describe('public-holidays.service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    describe('getListOfPublicHolidays', () => {
        const invalidCountry = 'US';
        const validYear = new Date().getFullYear();
        const invalidYear = validYear - 1;

        it('should return shorten public holidays list', async () => {
            axiosGetSpy.mockImplementation(() => Promise.resolve({data: PublicHolidaysListMock}));

            const shortPublicHolidays = await getListOfPublicHolidays(2023, SUPPORTED_COUNTRIES[0]);
            const isListShorten = shortPublicHolidays.every(checkIfShorterHoliday);

            expect(isListShorten).toBe(true);
            expect(shortPublicHolidays.length).toEqual(PublicHolidaysListMock.length)
        });
        it('should throw error params are not valid', async () => {
            const [validCountryCode] = SUPPORTED_COUNTRIES;
            const countryError = new Error(`Country provided is not supported, received: ${invalidCountry}`);
            const yearError = new Error(`Year provided not the current, received: ${invalidYear}`)

            await expect(getListOfPublicHolidays(validYear, invalidCountry)).rejects.toThrow(countryError);
            await expect(getListOfPublicHolidays(invalidYear, validCountryCode)).rejects.toThrow(yearError);
        });

        it('should return empty list if error occurs', async () => {
            axiosGetSpy.mockImplementation(() => Promise.reject(new Error('null pointer exception')));

            const shortPublicHolidays = await getListOfPublicHolidays(2023, SUPPORTED_COUNTRIES[0]);

            expect(shortPublicHolidays).toEqual([])
        });
        it('should call PublicHolidays with provided params', async () => {
            axiosGetSpy.mockImplementation(() => Promise.resolve({data: PublicHolidaysListMock}));

            const [_, countryCode] = SUPPORTED_COUNTRIES;
            // just to check it works with other indexes
            await getListOfPublicHolidays(validYear, countryCode);

            expect(axiosGetSpy).toHaveBeenCalledWith(`${PUBLIC_HOLIDAYS_API_URL}/PublicHolidays/${validYear}/${countryCode}`)
        });
    })

    describe('checkIfTodayIsPublicHoliday', () => {
        it('should call IsTodayPublicHoliday endpoint with provided country code param', async () => {
            const [countryCode] = SUPPORTED_COUNTRIES;

            axiosGetSpy.mockImplementation(() => Promise.resolve({status: 200}));

            await checkIfTodayIsPublicHoliday(countryCode);

            expect(axiosGetSpy).toHaveBeenCalledWith(`${PUBLIC_HOLIDAYS_API_URL}/IsTodayPublicHoliday/${countryCode}`)
        });
        it('returns true if status 200', async () => {
            jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve({status: 200}));

            const isTodayPublicHoliday = await checkIfTodayIsPublicHoliday(SUPPORTED_COUNTRIES[0]);

            expect(isTodayPublicHoliday).toBe(true);
        });

        it('should return false if error occurs', async () => {
            axiosGetSpy.mockImplementation(() => Promise.reject(new Error('unsupported country code')));

            const isTodayPublicHoliday = await checkIfTodayIsPublicHoliday(SUPPORTED_COUNTRIES[0]);

            expect(isTodayPublicHoliday).toBe(false);
        });
    });

    describe('getNextPublicHolidays', () => {
        it('should call NextPublicHolidays with provided country param', async () => {
            const [countryCode] = SUPPORTED_COUNTRIES;

            axiosGetSpy.mockImplementation(() => Promise.resolve({data: PublicHolidaysListMock}));

            await getNextPublicHolidays(countryCode);

            expect(axiosGetSpy).toHaveBeenCalledWith(`${PUBLIC_HOLIDAYS_API_URL}/NextPublicHolidays/${countryCode}`)
        });

        it('should return next shorten public holidays list', async () => {
            axiosGetSpy.mockImplementation(() => Promise.resolve({data: PublicHolidaysListMock}));

            const shortPublicHolidays = await getNextPublicHolidays(SUPPORTED_COUNTRIES[0]);
            const isListShorten = shortPublicHolidays.every(checkIfShorterHoliday);

            expect(isListShorten).toBe(true);
            expect(shortPublicHolidays.length).toEqual(PublicHolidaysListMock.length)
        });

        it('should return empty array on error', async () => {
            axiosGetSpy.mockImplementation(() => Promise.reject(new Error('Ooops... something went wrong')));

            const shortPublicHolidays = await getNextPublicHolidays(SUPPORTED_COUNTRIES[0]);

            expect(shortPublicHolidays).toEqual([]);
        });
    })
});
