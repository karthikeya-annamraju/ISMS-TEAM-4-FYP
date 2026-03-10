import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  HelpCircle, 
  Send, 
  Search,
  MessageSquare,
  Phone,
  Mail,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Layout from '../components/Layout';
import { useToast } from '../hooks/use-toast';

type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

interface SupportTicket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  date: string;
  category: string;
  userName: string;
  userEmail: string;
  description: string;
  adminResponse?: string;
}

const Support: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'billing',
    message: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'ALL'>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  
  // Mock tickets data with admin fields
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT-001',
      subject: 'Billing Issue - Duplicate Charge',
      status: 'OPEN',
      priority: 'HIGH',
      date: '2026-01-07',
      category: 'Billing',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      description: 'I was charged twice for my subscription this month. Please refund the duplicate charge.',
    },
    {
      id: 'TKT-002',
      subject: 'Cannot Access Premium Features',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      date: '2026-01-06',
      category: 'Technical',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      description: 'Upgraded to premium but still cannot access premium features.',
      adminResponse: 'Investigating the access control issue. Will resolve within 24 hours.',
    },
    {
      id: 'TKT-003',
      subject: 'Feature Request - Dark Mode',
      status: 'OPEN',
      priority: 'LOW',
      date: '2026-01-05',
      category: 'Feature Request',
      userName: 'Mike Johnson',
      userEmail: 'mike@example.com',
      description: 'Would love to see a dark mode option in the dashboard.',
    },
    {
      id: 'TKT-004',
      subject: 'Password Reset Not Working',
      status: 'RESOLVED',
      priority: 'HIGH',
      date: '2026-01-04',
      category: 'Technical',
      userName: 'Sarah Williams',
      userEmail: 'sarah@example.com',
      description: 'Password reset email not arriving.',
      adminResponse: 'Issue resolved. Email server configuration was fixed.',
    },
    {
      id: 'TKT-005',
      subject: 'Subscription Cancellation',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      date: '2026-01-03',
      category: 'Billing',
      userName: 'Robert Brown',
      userEmail: 'robert@example.com',
      description: 'Want to cancel my subscription but getting an error.',
      adminResponse: 'Processing your cancellation request.',
    },
  ]);

  const faqItems = [
    {
      question: 'How do I upgrade my plan?',
      answer: 'You can upgrade your plan from the Plans page or through your dashboard. Changes take effect immediately.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time from your dashboard. You\'ll retain access until the end of your billing period.'
    },
    {
      question: 'How do discount codes work?',
      answer: 'Enter your discount code on the Plans page or during checkout. Valid codes will be applied automatically to your bill.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for enterprise accounts.'
    }
  ];

  // Admin Actions
  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    ));
    toast({
      title: 'Status Updated',
      description: `Ticket ${ticketId} marked as ${newStatus}`,
    });
  };

  const handleAdminResponse = (ticketId: string) => {
    if (!adminResponse.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a response',
      });
      return;
    }

    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, adminResponse } : ticket
    ));
    
    toast({
      title: 'Response Added',
      description: 'Your response has been sent to the user',
    });
    
    setAdminResponse('');
    setSelectedTicket(null);
  };

  const handleEscalate = (ticketId: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, priority: 'HIGH' as TicketPriority } : ticket
    ));
    
    toast({
      title: 'Ticket Escalated',
      description: `Ticket ${ticketId} has been escalated to HIGH priority`,
    });
  };

  const handleSubmitTicket = () => {
    if (!ticketForm.subject || !ticketForm.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields',
      });
      return;
    }

    toast({
      title: 'Ticket Submitted',
      description: 'Your support ticket has been submitted. We\'ll get back to you soon!',
    });

    setTicketForm({ subject: '', category: 'billing', message: '' });
  };

  // Filtering
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN': return <Clock className="w-4 h-4" />;
      case 'IN_PROGRESS': return <MessageSquare className="w-4 h-4" />;
      case 'RESOLVED': return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'IN_PROGRESS': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'RESOLVED': return 'bg-green-500/20 text-green-600 border-green-500/30';
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-500/20 text-gray-600';
      case 'MEDIUM': return 'bg-orange-500/20 text-orange-600';
      case 'HIGH': return 'bg-red-500/20 text-red-600';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Render Admin View
  if (isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Support Ticket Management</h1>
                <p className="text-muted-foreground">
                  View and manage all user support tickets
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                  {tickets.filter(t => t.status === 'OPEN').length} Open
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">
                  {tickets.filter(t => t.status === 'IN_PROGRESS').length} In Progress
                </Badge>
                <Badge className="bg-red-500/20 text-red-600 border-red-500/30">
                  {tickets.filter(t => t.priority === 'HIGH').length} High Priority
                </Badge>
              </div>
            </motion.div>

            {/* Search and Filters */}
            <motion.div variants={itemVariants}>
              <Card className="card-glow">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'ALL')}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                      >
                        <option value="ALL">All Status</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </div>
                    <div>
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | 'ALL')}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                      >
                        <option value="ALL">All Priority</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tickets List */}
            <motion.div variants={itemVariants}>
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    All Support Tickets ({filteredTickets.length})
                  </CardTitle>
                  <CardDescription>
                    Click on a ticket to view details and take action
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{ticket.subject}</h4>
                              {ticket.priority === 'HIGH' && (
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <strong>{ticket.id}</strong>
                              </span>
                              <span>User: <strong>{ticket.userName}</strong></span>
                              <span>{ticket.category}</span>
                              <span>{ticket.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                            <Badge className={getStatusColor(ticket.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(ticket.status)}
                                {ticket.status}
                              </span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Ticket Details Modal */}
            {selectedTicket && (
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Card className="card-glow border-primary/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Ticket Details - {selectedTicket.id}
                          {selectedTicket.priority === 'HIGH' && (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                        </CardTitle>
                        <CardDescription>{selectedTicket.subject}</CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedTicket(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Ticket Info */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <Label className="text-xs text-muted-foreground">User Name</Label>
                        <p className="font-medium">{selectedTicket.userName}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Email</Label>
                        <p className="font-medium">{selectedTicket.userEmail}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Category</Label>
                        <p className="font-medium">{selectedTicket.category}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Created Date</Label>
                        <p className="font-medium">{selectedTicket.date}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Status</Label>
                        <Badge className={getStatusColor(selectedTicket.status)}>
                          {selectedTicket.status}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Priority</Label>
                        <Badge className={getPriorityColor(selectedTicket.priority)}>
                          {selectedTicket.priority}
                        </Badge>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <Label className="mb-2 block">Issue Description</Label>
                      <div className="p-4 bg-background border border-border rounded-lg">
                        <p className="text-sm">{selectedTicket.description}</p>
                      </div>
                    </div>

                    {/* Previous Admin Response */}
                    {selectedTicket.adminResponse && (
                      <div>
                        <Label className="mb-2 block">Previous Admin Response</Label>
                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <p className="text-sm">{selectedTicket.adminResponse}</p>
                        </div>
                      </div>
                    )}

                    {/* Admin Actions */}
                    <div className="space-y-4">
                      <Label>Admin Actions</Label>
                      
                      {/* Status Change */}
                      <div className="flex items-center gap-2">
                        <Label className="text-sm w-32">Change Status:</Label>
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            variant={selectedTicket.status === 'OPEN' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(selectedTicket.id, 'OPEN')}
                          >
                            Open
                          </Button>
                          <Button 
                            size="sm"
                            variant={selectedTicket.status === 'IN_PROGRESS' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(selectedTicket.id, 'IN_PROGRESS')}
                          >
                            In Progress
                          </Button>
                          <Button 
                            size="sm"
                            variant={selectedTicket.status === 'RESOLVED' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(selectedTicket.id, 'RESOLVED')}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Resolved
                          </Button>
                        </div>
                      </div>

                      {/* Escalate */}
                      {selectedTicket.priority !== 'HIGH' && (
                        <div className="flex items-center gap-2">
                          <Label className="text-sm w-32">Escalate:</Label>
                          <Button 
                            size="sm"
                            variant="destructive"
                            onClick={() => handleEscalate(selectedTicket.id)}
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Escalate to HIGH
                          </Button>
                        </div>
                      )}

                      {/* Admin Response */}
                      <div className="space-y-2">
                        <Label htmlFor="adminResponse">Add Response to User</Label>
                        <Textarea
                          id="adminResponse"
                          value={adminResponse}
                          onChange={(e) => setAdminResponse(e.target.value)}
                          placeholder="Enter your response to the user..."
                          rows={4}
                        />
                        <Button 
                          onClick={() => handleAdminResponse(selectedTicket.id)}
                          className="btn-primary"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Response
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Render User View (Original Support Page)
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-3xl font-bold mb-2">Support Center</h1>
            <p className="text-muted-foreground">
              Get help with your subscription and account
            </p>
          </motion.div>

          {/* Contact Options */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="card-glow text-center">
                <CardContent className="pt-6">
                  <MessageSquare className="w-8 h-8 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Available 24/7 for instant help
                  </p>
                  <Button className="btn-primary w-full">Start Chat</Button>
                </CardContent>
              </Card>
              
              <Card className="card-glow text-center">
                <CardContent className="pt-6">
                  <Mail className="w-8 h-8 mx-auto mb-4 text-success" />
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get detailed help via email
                  </p>
                  <Button className="btn-secondary w-full">Send Email</Button>
                </CardContent>
              </Card>
              
              <Card className="card-glow text-center">
                <CardContent className="pt-6">
                  <Phone className="w-8 h-8 mx-auto mb-4 text-special" />
                  <h3 className="font-semibold mb-2">Phone Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Call us for urgent issues
                  </p>
                  <Button className="btn-special w-full">Call Now</Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div variants={itemVariants}>
            <Card className="card-glow">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search FAQ, tickets, or ask a question..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Submit Ticket */}
            <motion.div variants={itemVariants}>
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Submit Support Ticket
                  </CardTitle>
                  <CardDescription>
                    Can't find what you're looking for? Submit a ticket
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    >
                      <option value="billing">Billing</option>
                      <option value="technical">Technical</option>
                      <option value="feature">Feature Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Describe your issue in detail"
                      rows={4}
                    />
                  </div>
                  
                  <Button onClick={handleSubmitTicket} className="w-full btn-primary">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* My Tickets */}
            <motion.div variants={itemVariants}>
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>My Support Tickets</CardTitle>
                  <CardDescription>
                    Track your submitted tickets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredTickets.slice(0, 3).map((ticket) => (
                      <div key={ticket.id} className="p-3 border border-border/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{ticket.subject}</h4>
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{ticket.category}</span>
                          <span>{ticket.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* FAQ */}
          <motion.div variants={itemVariants}>
            <Card className="card-glow">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFAQ.map((faq, index) => (
                    <div key={index} className="p-4 border border-border/50 rounded-lg">
                      <h4 className="font-medium mb-2">{faq.question}</h4>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Support;