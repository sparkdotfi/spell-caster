import core from '@actions/core'
import { HttpClient } from '@sparkdotfi/common-universal/http-client'
import { LogFormatterPretty, Logger, LoggerTransport } from '@sparkdotfi/common-universal/logger'
import { Config, getConfig } from './config'
import { ActionEnv } from './config/environment/ActionEnv'
import { ReportSender } from './periphery/reporter/ReportSender'

export interface Dependencies {
  httpClient: HttpClient
  reportSender: ReportSender
  config: Config
}

export function buildDependencies() {
  const actionsTransport: LoggerTransport = {
    debug: (message: string | object) => core.debug(message.toString()),
    log: (message: string | object) => core.info(message.toString()),
    warn: (message: string | object) => core.warning(message.toString()),
    error: (message: string | object) => core.error(message.toString()),
  }
  const logger = new Logger({
    service: undefined,
    logLevel: 'DEBUG',
    transports: [
      {
        transport: actionsTransport,
        formatter: new LogFormatterPretty(),
      },
    ],
  })

  const actionEnv = new ActionEnv()
  const config = getConfig(actionEnv, process.cwd())

  const httpClient = new HttpClient({}, logger)
  const reportSender = new ReportSender(config.slackWebhookUrl, logger, httpClient)

  return {
    logger,
    httpClient,
    reportSender,
    config,
  }
}
