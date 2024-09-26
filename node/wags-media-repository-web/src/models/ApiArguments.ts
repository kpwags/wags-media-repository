interface ApiArguments {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: any
    contentType?: string | null
    fileUpload?: boolean
    method?: string
    credentials?: 'include' | 'same-origin' | 'omit'
}

export default ApiArguments;