import { ConsoleReporter, IReporter, Report, SlackReporter } from '@sparkdotfi/common-reporters'
import { HttpClient } from '@sparkdotfi/common-universal/http-client'
import { Logger } from '@sparkdotfi/common-universal/logger'

export class ReportSender {
  constructor(
    private readonly wehbookUrl: string | undefined,
    private readonly logger: Logger,
    private readonly httpClient: HttpClient,
  ) {
    this.logger = logger.for(this)
  }

  async send(reports: Report[]): Promise<void> {
    for (const report of reports) {
      const reporters = this.getReporters()
      for (const reporter of reporters) {
        await reporter.report(report)
      }
    }
  }

  private getReporters(): IReporter[] {
    const consoleReporter = new ConsoleReporter(this.logger, 'info')

    if (!this.wehbookUrl) {
      return [consoleReporter]
    }

    this.wehbookUrl

    return [consoleReporter, new SlackReporter({ apiUrl: this.wehbookUrl }, this.httpClient)]
  }
}
