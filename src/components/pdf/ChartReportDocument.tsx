'use client';

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register fonts for Cyrillic support
Font.register({
  family: 'DejaVu',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/dejavu-sans@1.0.4/DejaVuSans.ttf',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/dejavu-sans@1.0.4/DejaVuSans-Bold.ttf',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'DejaVu',
    padding: 40,
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#0D4077',
  },
  logo: {
    width: 40,
    height: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D4077',
    textAlign: 'center',
    flex: 1,
  },
  date: {
    fontSize: 8,
    color: '#666666',
  },
  chartContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  chartImage: {
    width: 500,
    height: 300,
    objectFit: 'contain',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0C1E42',
    marginBottom: 10,
    textAlign: 'center',
  },
  chartDescription: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  metadataSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
  },
  metadataTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0D4077',
    marginBottom: 10,
  },
  metadataRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  metadataLabel: {
    width: 120,
    fontWeight: 'bold',
    color: '#333333',
  },
  metadataValue: {
    flex: 1,
    color: '#666666',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    paddingTop: 10,
    fontSize: 8,
    color: '#999999',
  },
  watermark: {
    position: 'absolute',
    bottom: 60,
    right: 40,
    fontSize: 8,
    color: '#CCCCCC',
  },
});

interface ChartReportDocumentProps {
  title: string;
  description?: string;
  chartImage?: string;
  metadata: {
    createdAt: string;
    chartType: string;
    datasets: string[];
    organization?: string;
    license?: string;
  };
  locale: string;
  labels: {
    reportTitle: string;
    generatedOn: string;
    chartType: string;
    datasets: string;
    organization: string;
    license: string;
    watermark: string;
  };
}

export function ChartReportDocument({
  title,
  description,
  chartImage,
  metadata,
  locale,
  labels,
}: ChartReportDocumentProps) {
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* @ts-expect-error react-pdf Image doesn't support alt */}
          <Image src='/serbia-logo.png' style={styles.logo} />
          <Text style={styles.title}>{title || labels.reportTitle}</Text>
          <Text style={styles.date}>
            {labels.generatedOn}: {metadata.createdAt}
          </Text>
        </View>

        {/* Chart Title & Description */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{title}</Text>
          {description && (
            <Text style={styles.chartDescription}>{description}</Text>
          )}
        </View>

        {/* Chart Image */}
        {chartImage && (
          <View style={styles.chartContainer}>
            {/* @ts-expect-error react-pdf Image doesn't support alt */}
            <Image src={chartImage} style={styles.chartImage} />
          </View>
        )}

        {/* Metadata Section */}
        <View style={styles.metadataSection}>
          <Text style={styles.metadataTitle}>{labels.reportTitle}</Text>

          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>{labels.chartType}:</Text>
            <Text style={styles.metadataValue}>{metadata.chartType}</Text>
          </View>

          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>{labels.datasets}:</Text>
            <Text style={styles.metadataValue}>
              {metadata.datasets.join(', ')}
            </Text>
          </View>

          {metadata.organization && (
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>{labels.organization}:</Text>
              <Text style={styles.metadataValue}>{metadata.organization}</Text>
            </View>
          )}

          {metadata.license && (
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>{labels.license}:</Text>
              <Text style={styles.metadataValue}>{metadata.license}</Text>
            </View>
          )}
        </View>

        {/* Watermark */}
        <Text style={styles.watermark}>{labels.watermark}</Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Vizuelni Admin Srbije | {locale}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
