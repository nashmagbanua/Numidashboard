
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useCoalYards } from '@/hooks/useCoalYards';
import { useChemicals } from '@/hooks/useChemicals';
import { usePowerConsumption } from '@/hooks/usePowerConsumption';
import { useToast } from '@/hooks/use-toast';

export const ExportButton: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { data: coalYards } = useCoalYards();
  const { data: chemicals } = useChemicals();
  const { data: powerData } = usePowerConsumption();
  const { toast } = useToast();

  const convertToCSV = (data: any[], headers: string[]) => {
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(',')
    );
    return [csvHeaders, ...csvRows].join('\n');
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Create timestamp for filenames
      const timestamp = new Date().toISOString().split('T')[0];
      
      // Export Coal Yards
      if (coalYards && coalYards.length > 0) {
        const coalCSV = convertToCSV(coalYards, ['yard_name', 'yard_number', 'status', 'last_updated']);
        downloadCSV(coalCSV, `coal_yards_${timestamp}.csv`);
      }
      
      // Export Chemicals
      if (chemicals && chemicals.length > 0) {
        const chemCSV = convertToCSV(chemicals, ['name', 'cby', 'liters', 'status', 'last_updated']);
        downloadCSV(chemCSV, `chemicals_${timestamp}.csv`);
      }
      
      // Export Power Consumption
      if (powerData && powerData.length > 0) {
        const powerCSV = convertToCSV(powerData, ['section', 'consumption_kw', 'recorded_at']);
        downloadCSV(powerCSV, `power_consumption_${timestamp}.csv`);
      }
      
      toast({
        title: "Export Complete",
        description: "Data has been exported to CSV files",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-40">
      <Button
        onClick={handleExport}
        disabled={isExporting}
        className="nums-gradient shadow-lg hover:shadow-xl transition-shadow"
        size="lg"
      >
        {isExporting ? (
          <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
        ) : (
          <Download className="h-5 w-5 mr-2" />
        )}
        {isExporting ? 'Exporting...' : 'Export to CSV'}
      </Button>
    </div>
  );
};
