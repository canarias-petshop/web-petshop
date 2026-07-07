import {
  createRedsysAPI,
  SANDBOX_URLS,
  PRODUCTION_URLS,
  useSingleInputFormatter,
  useOutputFormatter,
  redirectInputFormatter,
  restNotificationOutputFormatter,
} from 'redsys-easy';

const secretKey = process.env.REDSYS_SECRET_KEY || '';
const isTest = process.env.REDSYS_ENV === 'test';

const {
  createRedirectForm: baseCreateRedirectForm,
  processRestNotification: baseProcessRestNotification,
} = createRedsysAPI({
  secretKey,
  urls: isTest ? SANDBOX_URLS : PRODUCTION_URLS
});

// Envolvemos con formatters para poder usar { amount: '12.50', currency: 'EUR' }
export const createRedirectForm = useSingleInputFormatter(baseCreateRedirectForm, redirectInputFormatter);
export const processRestNotification = useOutputFormatter(baseProcessRestNotification, restNotificationOutputFormatter);

export const redsysMerchantCode = process.env.REDSYS_MERCHANT_CODE || '';
export const redsysTerminal = process.env.REDSYS_TERMINAL || '1';
