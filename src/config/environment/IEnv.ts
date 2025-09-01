export interface IEnv {
  string(key: string, fallback?: string): string
  optionalString(key: string): string | undefined
}
