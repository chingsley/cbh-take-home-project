import { deterministicPartitionKey } from "./dpk";

describe('npm install --save-dev jest', () => {
  it('returns the TRIVIAL_PARTITION_KEY when event is undefined', () => {
    const candidate = deterministicPartitionKey();
    expect(candidate).toEqual("0");
  });

  it('creates hash using the event.partitionKey when it exists', () => {
    const event = {
      partitionKey: 'A1223B12'
    };
    const candidate = deterministicPartitionKey(event);
    expect(candidate).toBeLessThan(256);
  });

  it('creates hash using the event data when partitionKey does not exist', () => {
    const event = new Event("hash");
    const candidate = deterministicPartitionKey(event);
    expect(candidate).toBeLessThan(256);
  });

  it('re-hashes the result if has length greater than 256', () => {
    const event = {
      partitionKey: 'A1223B12A1223B12A1223B12A1223B12A1223B12'
    };
    const candidate = deterministicPartitionKey(event);
    expect(candidate).toBeLessThan(256);
  });
});