import axios from "axios";

export interface User {
  row_number: number;
  UserName: string;
  DocId: string;
}

export interface ServiceResult {
  error: string;
  message: string;
  data: {
    UserName: string;
    DocUrl: string;
  };
}

export interface KeywordResult {
  key?: string,
  value?: string,
}

export interface CommonResult {}

const api = axios.create({
  baseURL: "https://vienmibi.app.n8n.cloud/webhook/",
});

export const userService = {
  /**
   * Lấy danh sách User
   */
  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get<User[]>(
        "/b316d066-83a5-44dd-890b-667161deb7b4/Users"
      );
      return response.data;
    } catch (error) {
      console.log("Error fetching users:", error);
      return [];
    }
  },

  /**
   * Thêm User mới
   * @param userName
   * @returns
   */
  async addUser(userName: string): Promise<ServiceResult[]> {
    try {
      const response = await api.post<ServiceResult[]>(
        `/dafe99c4-b4ce-4178-a64b-aadddb270137/User`,
        { userName: userName },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      console.log("Error checking duplicate user:", error);
      return [];
    }
  },

  /**
   * Lấy danh sách keyword(chủ đề) user đã search
   * @param userName
   * @returns
   */
  async getKeyWordByUser(userName: string): Promise<KeywordResult[]> {
    try {
      const response = await api.get(
        `/3edcaf2b-53d7-4390-8c50-f270b597721b/User/KeyWords?userName=${userName}`,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      console.log("Get Keyword by user:", error);
      return [];
    }
  },

  /**
   * B1: Tìm kiếm nội dung theo chủ đề
   * @param userName
   * @param keyword
   * @returns
   */
  async research(userName: string, keyword: string): Promise<string> {
    try {
      const response = await api.post(
        `/292f105e-5caf-4b36-b31a-c61e680a4fbb/Research`,
        { userName: userName, keyWord: keyword },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data[0].docUrl;
    } catch (error) {
      console.log("Research Topic:", error);
      return "";
    }
  },

  /**
   * B2: Tạo bestoutline
   * @param userName
   * @param keyword
   * @returns
   */
  async createBestOutline(
    userName: string,
    keyword: string
  ): Promise<string> {
    try {
      const response = await api.post(
        `/7a23dfce-736d-4945-a36b-1cce59bda551/BestOutline`,
        { userName: userName, keyWord: keyword },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data?.docUrl ?? "";
    } catch (error) {
      console.log("Create post by best outline:", error);
      return "";
    }
  },

  /**
   * B3: Tạo bài viết từ bestoutline
   */
  async createPostFromBestOutline(
    userName: string,
    keyWord: string
  ): Promise<string> {
    try {
      const response = await api.get(
        `/c5837697-dceb-429a-93ab-c2b0397ebef1/WritePost?userName=${userName}&keyWord=${keyWord}`,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data.postDocUrl;
    } catch (error) {
      console.log("Create post by best outline:", error);
      return "";
    }
  },

  /**
   * B4: Đẩy bài viết lên WordPRess
   * @param userName
   * @param linkDoc
   * @returns
   */
  async pushToWordPress(userName: string, linkDoc: string): Promise<string> {
    try {
      const response = await api.post(
        `/40d56a50-09fe-4b69-bb27-8301ca572c3b/Post`,
        { userName: userName, linkDoc: linkDoc },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data.postUrl;
    } catch (error) {
      console.log("Push To WordPress:", error);
      return "";
    }
  },
};
