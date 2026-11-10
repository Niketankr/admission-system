import { Application, DashboardStats, ApplicationStatus } from '../models/application.model';

export class ApplicationService {
  private apiUrl = '/api/applications';

  private getHeaders(isFormData = false): HeadersInit {
    const token = localStorage.getItem('admission_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (!isFormData) headers['Content-Type'] = 'application/json';
    return headers;
  }

  // Student: Submit application with Multer document payload
  async submitApplication(formData: FormData): Promise<{ message: string; application: Application }> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: formData
    });
    return res.json();
  }

  // Student: Get current application & status history
  async getMyApplication(): Promise<{ application: Application }> {
    const res = await fetch(`${this.apiUrl}/my`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  // Admin: Get all applications with search and filters
  async getAllApplications(params?: { department?: string; status?: string; search?: string }): Promise<{ count: number; applications: Application[] }> {
    const query = new URLSearchParams();
    if (params?.department && params.department !== 'All') query.append('department', params.department);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${this.apiUrl}?${query.toString()}`, {
      headers: this.getHeaders()
    });
    return res.json();
  }

  // Admin: Update status with comments following state workflow
  async updateStatus(id: string, status: ApplicationStatus, comments?: string): Promise<{ message: string; application: Application }> {
    const res = await fetch(`${this.apiUrl}/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, comments })
    });
    return res.json();
  }

  // Admin: Get analytics dashboard statistics (MongoDB aggregation)
  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${this.apiUrl}/stats/summary`, {
      headers: this.getHeaders()
    });
    return res.json();
  }
}

