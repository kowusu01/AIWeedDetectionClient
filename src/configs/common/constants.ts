export class Constants {
    public static readonly VITE_AZURE_APP_CONFIG_CONNECTION_STRING = "VITE_AZURE_APP_CONFIG_CONNECTION_STRING";
    public static readonly VITE_PREDICTIONS_API_ENDPOINT = "VITE_PREDICTIONS_API_ENDPOINT";
    public static readonly VITE_TEST_DATA_STORAGE_CONTAINER = "VITE_TEST_DATA_STORAGE_CONTAINER";
    
    public static readonly LogLevel = "LogLevel";

    public static readonly PREDICTIONS_ANALYZE_BY_FILE_ENDPOINT ="prediction/analyze/file/";
    public static readonly PREDICTIONS_ANALYZE_BY_FILENAME_ENDPOINT ="prediction/analyze/filename/";
    public static readonly PREDICTIONS_IMAGE_ENDPOINT ="prediction/image/";
    public static readonly PREDICTIONS_DETAILS_ENDPOINT="prediction/details/";

    public static readonly DEFAULT_PREDICTIONS_API_ENDPOINT = "https://aiweeddetectionapi.azurewebsites.net/";
    public static readonly DEFAULT_TEST_DATA_STORAGE_CONTAINER = "https://grasstestdata.blob.core.windows.net/grasstestdatacontainer/";


    }