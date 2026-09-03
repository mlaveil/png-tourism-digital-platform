/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { dbStore } from './src/server/store';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Request logger middleware
  app.use((req, _res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // Helper to extract actor from request header/body
  const getActor = (req: Request) => {
    const name = (req.headers['x-user-name'] as string) || req.body?.actorName || 'TPA Officer';
    const role = (req.headers['x-user-role'] as string) || req.body?.actorRole || 'staff';
    return { name, role };
  };

  // --- API Endpoints ---

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'PNG Tourism Digital Platform - National Central Registry API',
      timestamp: new Date().toISOString(),
      version: '1.0.0-mvp'
    });
  });

  // Reset database to pristine demo state
  app.post('/api/seed/reset', (req: Request, res: Response) => {
    const actor = getActor(req);
    dbStore.resetToDefaults();
    dbStore.logAudit(actor.name, actor.role, 'Database Reset', 'System', 'SEED-RESET', undefined, undefined, 'Registry reset to default initial state');
    res.json({ success: true, message: 'Database reset to default seed data.' });
  });

  // Analytics & Dashboard
  app.get('/api/dashboard', (_req: Request, res: Response) => {
    const data = dbStore.getDashboardAnalytics();
    res.json(data);
  });

  // Audit Logs
  app.get('/api/audit-logs', (_req: Request, res: Response) => {
    const logs = dbStore.getAuditLogs();
    res.json(logs);
  });

  // Notifications
  app.get('/api/notifications', (req: Request, res: Response) => {
    const role = req.query.role as string;
    const operatorId = req.query.operatorId as string;
    const items = dbStore.getNotifications(role, operatorId);
    res.json(items);
  });

  app.post('/api/notifications/:id/read', (req: Request, res: Response) => {
    const item = dbStore.markNotificationRead(req.params.id);
    res.json({ success: !!item, item });
  });

  // Provinces & Categories
  app.get('/api/provinces', (_req: Request, res: Response) => {
    res.json(dbStore.getProvinces());
  });

  app.get('/api/categories', (_req: Request, res: Response) => {
    res.json(dbStore.getCategories());
  });

  // Operators (Registry)
  app.get('/api/operators', (req: Request, res: Response) => {
    const { search, province, category, status, compliance } = req.query;
    const operators = dbStore.getOperators({
      search: search as string,
      province: province as string,
      category: category as string,
      status: status as string,
      compliance: compliance as string
    });
    res.json(operators);
  });

  app.post('/api/operators', (req: Request, res: Response) => {
    const actor = getActor(req);
    try {
      const op = dbStore.createOperator(req.body, actor);
      res.status(201).json(op);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/operators/:id', (req: Request, res: Response) => {
    const op = dbStore.getOperatorById(req.params.id);
    if (!op) {
      res.status(404).json({ error: 'Operator not found' });
      return;
    }
    res.json(op);
  });

  app.put('/api/operators/:id', (req: Request, res: Response) => {
    const actor = getActor(req);
    const updated = dbStore.updateOperator(req.params.id, req.body, actor);
    if (!updated) {
      res.status(404).json({ error: 'Operator not found' });
      return;
    }
    res.json(updated);
  });

  // Public Operators API (Stripped of internal sensitive compliance and staff audit details)
  app.get('/api/public/operators', (req: Request, res: Response) => {
    const { search, province, category } = req.query;
    const ops = dbStore.getOperators({
      search: search as string,
      province: province as string,
      category: category as string,
      publicOnly: true
    });

    const sanitized = ops.map(op => ({
      id: op.id,
      businessName: op.businessName,
      tradingName: op.tradingName,
      operatorType: op.operatorType,
      categoryId: op.categoryId,
      categoryName: op.categoryName,
      province: op.province,
      district: op.district,
      address: op.address,
      contactPerson: op.contactPerson,
      email: op.email,
      phone: op.phone,
      website: op.website,
      description: op.description,
      latitude: op.latitude,
      longitude: op.longitude,
      heroImage: op.heroImage,
      galleryImages: op.galleryImages,
      features: op.features,
      priceRange: op.priceRange,
      rating: op.rating,
      reviewCount: op.reviewCount,
      membershipStatus: op.membershipStatus,
      isVerified: op.registrationStatus === 'Registered',
      hasActiveLicence: op.licenseStatus === 'Active'
    }));

    res.json(sanitized);
  });

  app.get('/api/public/operators/:id', (req: Request, res: Response) => {
    const op = dbStore.getOperatorById(req.params.id);
    if (!op || op.registrationStatus !== 'Registered') {
      res.status(404).json({ error: 'Public listing not found or not yet approved for publication' });
      return;
    }

    res.json({
      id: op.id,
      businessName: op.businessName,
      tradingName: op.tradingName,
      operatorType: op.operatorType,
      categoryId: op.categoryId,
      categoryName: op.categoryName,
      province: op.province,
      district: op.district,
      address: op.address,
      contactPerson: op.contactPerson,
      email: op.email,
      phone: op.phone,
      website: op.website,
      description: op.description,
      latitude: op.latitude,
      longitude: op.longitude,
      heroImage: op.heroImage,
      galleryImages: op.galleryImages,
      features: op.features,
      priceRange: op.priceRange,
      rating: op.rating,
      reviewCount: op.reviewCount,
      membershipStatus: op.membershipStatus,
      isVerified: true,
      hasActiveLicence: op.licenseStatus === 'Active'
    });
  });

  // Registrations Workflow
  app.get('/api/registrations', (_req: Request, res: Response) => {
    res.json(dbStore.getRegistrations());
  });

  app.post('/api/registrations', (req: Request, res: Response) => {
    const actor = getActor(req);
    try {
      const reg = dbStore.createRegistration(req.body.operatorId, actor, req.body.notes);
      res.status(201).json(reg);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/registrations/:id', (req: Request, res: Response) => {
    const reg = dbStore.getRegistrationById(req.params.id);
    if (!reg) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }
    res.json(reg);
  });

  app.put('/api/registrations/:id/status', (req: Request, res: Response) => {
    const actor = getActor(req);
    const { status, notes } = req.body;
    const updated = dbStore.updateRegistrationStatus(req.params.id, status, actor, notes);
    if (!updated) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }
    res.json(updated);
  });

  // Memberships
  app.get('/api/memberships', (_req: Request, res: Response) => {
    res.json(dbStore.getMemberships());
  });

  app.post('/api/memberships', (req: Request, res: Response) => {
    const actor = getActor(req);
    try {
      const mem = dbStore.createMembership(req.body, actor);
      res.status(201).json(mem);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/memberships/:id/status', (req: Request, res: Response) => {
    const actor = getActor(req);
    const { status, notes } = req.body;
    const updated = dbStore.updateMembershipStatus(req.params.id, status, actor, notes);
    if (!updated) {
      res.status(404).json({ error: 'Membership not found' });
      return;
    }
    res.json(updated);
  });

  // Licenses
  app.get('/api/licenses', (_req: Request, res: Response) => {
    res.json(dbStore.getLicenses());
  });

  app.post('/api/licenses', (req: Request, res: Response) => {
    const actor = getActor(req);
    try {
      const lic = dbStore.createLicense(req.body, actor);
      res.status(201).json(lic);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/licenses/:id/status', (req: Request, res: Response) => {
    const actor = getActor(req);
    const { status, notes } = req.body;
    const updated = dbStore.updateLicenseStatus(req.params.id, status, actor, notes);
    if (!updated) {
      res.status(404).json({ error: 'License not found' });
      return;
    }
    res.json(updated);
  });

  // Compliance
  app.get('/api/compliance/:operatorId', (req: Request, res: Response) => {
    const comp = dbStore.getCompliance(req.params.operatorId);
    res.json(comp);
  });

  app.put('/api/compliance/:operatorId/requirement', (req: Request, res: Response) => {
    const actor = getActor(req);
    const { requirementId, status, notes } = req.body;
    try {
      const updated = dbStore.updateComplianceRequirement(req.params.operatorId, requirementId, status, actor, notes);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- Vite Dev Middleware / Production Static Serve ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PNG TPA Platform] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start PNG TPA Platform server:', err);
});
