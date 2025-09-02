import { ConsoleReporter, IReporter, Report } from '@sparkdotfi/common-reporters'
import { HttpClient } from '@sparkdotfi/common-universal/http-client'
import { Logger } from '@sparkdotfi/common-universal/logger'

export class ReportSender {
  reporters: IReporter[]

  constructor(
    private readonly wehbookUrl: string | undefined,
    private readonly logger: Logger,
    private readonly httpClient: HttpClient,
  ) {
    this.logger = logger.for(this)
    this.reporters = this.createReporters()
  }

  async send(reports: Report[]): Promise<void> {
    for (const report of reports) {
      for (const reporter of this.reporters) {
        await reporter.report(report)
      }
    }
  }

  private createReporters(): IReporter[] {
    const consoleReporter = new ConsoleReporter(this.logger, 'info')

    if (!this.wehbookUrl) {
      return [consoleReporter]
    }

    // return [consoleReporter, new SlackReporter({ apiUrl: this.wehbookUrl }, this.httpClient)]
    return [consoleReporter]
  }
}
